using Quarere.Classes;
using Quarere.Entities;
using Quarere.Models;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using static Quarere.Classes.ConvertFileToText;
using static Quarere.Classes.ConnectionStringGenerator;
using System.Collections;
using static Quarere.Classes.WordsOperations;
using System.Threading;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Diagnostics;
using Quarere.Cors;
using Quarere.Translate_Engine;
using System.Data.SqlClient;
using System.Data;
using static Quarere.Models.WordOperationsModel;
using static Quarere.Classes.SqlOperations;
using System.Configuration;
using Quarere.Translate_Engine;

namespace Quarere.Controllers
{
    public class UserTextManagementController : ApiController
    {
        private static Dictionary<string, HashSet<IndexesData>> CurrentPhraseIndexes = new Dictionary<string, HashSet<IndexesData>>();
        private static Dictionary<string, UserTextData> UsersData = new Dictionary<string, UserTextData>();
        private static HttpClient Client;

        private void FileInsert(MultipartFileData file, string rootPath, string fileName)
        {
            var localFileName = file.LocalFileName;
            var filePath = Path.Combine(rootPath, fileName);
            File.Move(localFileName, filePath);
        }

        private async Task<WordProperties> GetWordPropertiesAsync(string Word)
        {
            string url = $"https://api.dictionaryapi.dev/api/v2/entries/en/{Word}";
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            if (Client == null)
            {
                HttpClientHandler ClientConfiguration = new HttpClientHandler
                {
                    Proxy = null,
                    UseProxy = false
                };
                Client = HttpClientFactory.Create(ClientConfiguration);
                Client.Timeout = TimeSpan.FromSeconds(5.5);
            }
            //System.Net.ServicePointManager.SecurityProtocol =
            //SecurityProtocolType.Tls12 |
            //SecurityProtocolType.Tls11 |
            //SecurityProtocolType.Tls;
            Debug.WriteLine("ClientWait");
            //HttpResponseMessage response = await Client.SendAsync(request);
            Debug.WriteLine(Word);

            string Origin;
            string PhoneticText, Audio;
            PhoneticData Phonetics;
            string JSON_WordParameters = "";
            try
            {
                //JSON_WordParameters = await Client.GetStringAsync(url);
                var response = await Client.SendAsync(request);
                JSON_WordParameters = await response.Content.ReadAsStringAsync();
            }
            catch (TimeoutException)
            {
                Debug.WriteLine("Error");
                //JSON_WordParameters = await Client.GetStringAsync(url);
                var response = await Client.SendAsync(request);
                var statusCode = response.StatusCode;
            }
            catch (System.Net.Http.HttpRequestException)
            {
                Debug.WriteLine("Error2");
                //JSON_WordParameters = await Client.GetStringAsync(url);
                var response = await Client.SendAsync(request);
                JSON_WordParameters = await response.Content.ReadAsStringAsync();
            }
            //var JSON_WordParameters = await response.Content.ReadAsStringAsync();
            Debug.WriteLine(Word);
            if (JSON_WordParameters.StartsWith("["))
            {
                // Do nothing
            }
            else
            {
                string WordLevel = FindWordLevel(Word);
                return new WordProperties(Word, WordLevel);
            }
            JArray Parsed_WordParameters = JArray.Parse(JSON_WordParameters);
            JObject Properties = (JObject)Parsed_WordParameters[0];
            if (Properties["phonetics"].HasValues)
            {
                if(Properties["phonetics"][0]["text"] != null)
                {
                    PhoneticText = Properties["phonetics"][0]["text"].ToString();
                }
                else { PhoneticText = ""; }
                if(Properties["phonetics"][0]["audio"] != null)
                {
                    Audio = Properties["phonetics"][0]["audio"].ToString();
                }
                else { Audio = ""; }
                Phonetics = new PhoneticData(PhoneticText, Audio);
            }
            else
            {
                Phonetics = JsonConvert.DeserializeObject<PhoneticData>
                    ("{\"text\": \"\",\"audio\": \"\"}");
            }
            if (Properties.ContainsKey("origin"))
            {
                Origin = Properties["origin"].ToString();
            }
            else
            {
                Origin = "";
            }
            JArray Meanings = (JArray)Properties["meanings"];
            List<WordVariant> Variants = Meanings.ToObject<List<WordVariant>>();
            List<WordVariantWithNativeTranslation> VariantsWithTranslation = new List<WordVariantWithNativeTranslation>();
            foreach(var Variant in Variants)
            {
                Variant.Definitions.RemoveAll(x => Variant.Definitions.IndexOf(x) > 0);
                foreach(var Definition in Variant.Definitions)
                {
                    Definition.Synonyms.RemoveAll(x => Definition.Synonyms.IndexOf(x) > 3);
                }
                WordVariantWithNativeTranslation CurrentElement = new WordVariantWithNativeTranslation();
                CurrentElement.PartOfSpeech = Variant.PartOfSpeech;
                CurrentElement.Definition = new WordAssociationsWithNativeTranslation
                {
                    Definition = Variant.Definitions[0].Definition,
                    Example = Variant.Definitions[0].Example,
                    Synonyms = Variant.Definitions[0].Synonyms,
                    Antonyms = Variant.Definitions[0].Antonyms,
                    NativeDefinition = FindPolishTranslation(Word, Variant.PartOfSpeech)
                };
                VariantsWithTranslation.Add(CurrentElement);
            }

            string Level = FindWordLevel(Word);

            WordProperties ExtendedWord = new WordProperties(Word, Phonetics,
                Origin, VariantsWithTranslation, Level);
            return ExtendedWord;
        }

        private async Task<List<WordProperties>> GetWordDataAsync(SortedSet<string> Words)
        {
            List<Task<WordProperties>> GetPropertiesTasks = new List<Task<WordProperties>>();
            List<WordProperties> WordList = new List<WordProperties>();
            foreach (string Word in Words)
            {
                Debug.WriteLine(Word + " ");
                GetPropertiesTasks.Add(Task.Run(() => 
                    GetWordPropertiesAsync(Word)
                ));
            }
            var results = await Task.WhenAll(GetPropertiesTasks);
            foreach(var result in results)
            {
                WordList.Add(result);
            }
            WordList.RemoveAll(x => x.Word == "");
            return WordList;
        }

        [HttpPost]
        [Route("api/usertextmanagementcontroller/test")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<WordProperties> Test()
        {
            try
            {
                string Input = await Request.Content.ReadAsStringAsync();
                var ParsedInput = JObject.Parse(Input);
                var Result = await TranslateEngine.QueryInternet(ParsedInput["word"].ToString());
                return await TranslateEngine.Transform(Result, ParsedInput["word"].ToString(), ParsedInput["language"].ToString());
            }
            catch
            {
                return new WordProperties();
            }
        }

        [HttpPost]
        [Route("api/usertextmanagementcontroller/uploadviafile")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> UploadTextDataViaFile()
        {
            Debug.WriteLine(0);
            string username = Thread.CurrentPrincipal.Identity.Name.ToString();
            var ctx = HttpContext.Current;
            var root = ctx.Server.MapPath("~/App_Data/File_Upload");
            var provider = new MultipartFormDataStreamProvider(root);
            Debug.WriteLine(1);

            try
            {
                await Request.Content.ReadAsMultipartAsync(provider);

                foreach (var file in provider.FileData)
                {
                    var name = string.IsNullOrWhiteSpace(file.Headers.ContentDisposition.FileName) ?
                        "NoName" : file.Headers.ContentDisposition.FileName;
                    name = name.Trim('"');
                    var fileSize = new FileInfo(file.LocalFileName).Length / 1024 / 1024;
                    if(fileSize > 10) { break; }

                    string text = "";
                    string title = provider.FormData["title"];
                    string description = provider.FormData["description"];
                    if(!(title.Length > 0 && title.Length < 31))
                    {
                        break;
                    }

                    if(description.Length > 100)
                    {
                        break;
                    }

                    string uploadMethod = provider.FormData["upload-method"];
                    string fileExtension = Path.GetExtension(name);
                    if(uploadMethod == "doc")
                    {
                        if (fileExtension != ".pdf") { break; }
                        else 
                        {
                            Debug.WriteLine(2);
                            if (fileSize > 0.5) { break; }
                            FileInsert(file, root, name);
                            Debug.WriteLine(3);
                            text = ConvertPDFToText(name);
                        }
                    }
                    else if(uploadMethod == "scan")
                    {
                        if (fileExtension != ".pdf") { break; }
                        else 
                        {
                            List<string> Pages = new List<string>();
                            FileInsert(file, root, name);
                            Pages = ConvertScanToText(name);
                            foreach(var page in Pages)
                            {
                                text = text + page;
                            }
                        }
                    }
                    else if(uploadMethod == "img")
                    {
                        if (fileExtension != ".png" && fileExtension != ".jpg" && fileExtension != "jpeg") 
                        { 
                            break; 
                        }
                        else 
                        {
                            FileInsert(file, root, name);
                            text = ConvertImageToText(name); 
                        }
                    }
                    else { break; }

                    Debug.WriteLine(username);
                    //string connectionString = GetUserConnectionString(username);
                    //SqlConnection con = new SqlConnection(connectionString);
                    //if (con.State == ConnectionState.Closed)
                    //{
                    //    con.Open();
                    //}

                    //if (CheckIfTextTitleExists(title, con) == true)
                    //{
                    //    con.Close();
                    //    return "Title Exists";
                    //}

                    Debug.WriteLine(10);
                    string TextCleared = ClearString(text);
                    List<string> Words = TextCleared.Split(' ').ToList<string>();

                    UserTextData UserData = new UserTextData(title, description, Words, text.Trim());
                    UsersData[Thread.CurrentPrincipal.Identity.Name.ToString()] = UserData;
                    Debug.WriteLine(20);

                    //con.Close();
                    return text;

                    //string return1="";
                    //var results = await GetWordDataAsync(Words);
                    //foreach(var result in results)
                    //{
                    //    return1 = return1 + " " + result.Word;
                    //}
                    //return return1;
                }
            }   
            catch(Exception e)
            {
                return e.Message;
            }
            return "Something went wrong";
        }

        [HttpPost]
        [Route("api/usertextmanagementcontroller/uploadviatextbox")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> UploadTextDataViaTextbox()
        {
            var provider = new MultipartFormDataStreamProvider("~/App_Data/File_Upload");

            try
            {
                await Request.Content.ReadAsMultipartAsync(provider);

                string title = provider.FormData["title"];
                string description = provider.FormData["description"];
                string text = provider.FormData["text"];
                if (!(title.Length > 0 && title.Length < 31))
                {
                    return "Something went wrong";
                }

                if (description.Length > 100)
                {
                    return "Something went wrong";
                }

                if (!(text.Length > 0 && text.Length < 10000))
                {
                    return "Something went wrong";
                }

                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                string connectionString = GetUserConnectionString(username);
                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                if (CheckIfTextTitleExists(title, con) == true)
                {
                    con.Close();
                    return "Title Exists";
                }
                //Debug.WriteLine(GetLongWords(text));

                string TextCleared = ClearString(text);
                List<string> Words = TextCleared.Split(' ').ToList<string>();

                UserTextData UserData = new UserTextData(title, description, Words, text);
                UsersData[Thread.CurrentPrincipal.Identity.Name.ToString()] = UserData;

                //var results = await GetWordDataAsync(Words);
                //con.Close();
                return "Success";
                //return results[0].Word;
            }
            catch (Exception e)
            {
                return (e.Message);
            }
        }

        [HttpPost]
        [Route("api/usertextmanagementcontroller/loadfromexternalsource")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> LoadFromExternalSource()
        {
            try
            {
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                string title = await Request.Content.ReadAsStringAsync();
                string connectionString = GetUserConnectionString(username);
                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }
                string getTextDataCmd = "SELECT * FROM UserTexts WHERE title = @title;";
                SqlCommand getTextData = new SqlCommand(getTextDataCmd, con);
                getTextData.Parameters.AddWithValue("@title", SqlDbType.NVarChar).Value = title;
                Debug.WriteLine("Checkpoint");
                using (SqlDataReader rdr = getTextData.ExecuteReader())
                {
                    while (rdr.Read())
                    {
                        string Text = rdr.GetString(3);
                        string TextCleared = ClearString(Text);
                        List<string> Words = TextCleared.Split(' ').ToList<string>();
                        if (rdr.IsDBNull(2))
                        {
                            UserTextData UserData = new UserTextData(title, "", Words, Text);
                            UsersData[username] = UserData;
                        }
                        else
                        {
                            UserTextData UserData = new UserTextData(title, rdr.GetString(2), Words, Text);
                            UsersData[username] = UserData;
                        }
                    }
                }
                con.Close();
                return "Success";
            }
            catch
            {
                return "Something Went Wrong";
            }
        }

        [HttpGet]
        [Route("api/usertextmanagementcontroller/gettext")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<UserTextCompleteData> GetTextWithProperties()
        {
            try
            {
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                if (UsersData[username].Words.Count < 300)
                {
                    List<WordWithLevel> Phrases = GetLongWords(UsersData[username].Text);
                    List<WordWithLevel> UserWords = new List<WordWithLevel>();

                    List<string> Words = new List<string>();
                    Words = UsersData[username].Words;
                    CurrentPhraseIndexes[username] = new HashSet<IndexesData>();

                    foreach (string Word in Words)
                    {
                        UserWords.Add(new WordWithLevel(Word, FindWordLevel(Word)));
                    }

                    int FirstFreeIndexForPhrase = 0;
                    for (int i = 0; i < Phrases.Count; i++)
                    {
                        var PhraseWords = Phrases[i].Word.Split(' ');
                        var Indexes = UserWords.Select((WordAndLevel, Index) => new { CurrentWord = WordAndLevel.Word, Index })
                            .Where(WordAndLevel => WordAndLevel.CurrentWord == PhraseWords[0])
                            .Select(Element => Element.Index).ToArray();

                        foreach (int Index in Indexes) {
                            Debug.WriteLine(Index);
                        }
                        for (int k = 0; k < Indexes.Length; k++)
                        {
                            bool isMultiWordValid = true;
                            for (int j = 1; j < PhraseWords.Length; j++)
                            {
                                try
                                {
                                    isMultiWordValid = UserWords[Indexes[k] + j].Word == PhraseWords[j];
                                }
                                catch
                                {
                                    isMultiWordValid = false;
                                    break;
                                }

                                if (isMultiWordValid == false)
                                {
                                    break;
                                }
                            }

                            if (isMultiWordValid)
                            {
                                var Temporary = UserWords[FirstFreeIndexForPhrase];
                                UserWords[FirstFreeIndexForPhrase] = Phrases[i];
                                UserWords[Indexes[k]] = Temporary;
                                UserWords.RemoveRange(Indexes[k] + 1, PhraseWords.Length - 1);
                                CurrentPhraseIndexes[username].Add(new IndexesData(Indexes[k], Phrases[i]));
                                FirstFreeIndexForPhrase++;
                            }
                        }
                    }

                    UserTextCompleteData FinalOutput = new UserTextCompleteData(
                        UsersData[username].Title, UsersData[username].Description,
                        UserWords, UsersData[username].Text, 1);
                    return FinalOutput;
                }

                else
                {
                    decimal NumberOfPagesDecimal = Decimal.Divide(UsersData[username].Words.Count, 300);
                    decimal NumberOfPages = Math.Ceiling(NumberOfPagesDecimal);

                    List<WordWithLevel> Phrases = GetLongWords(UsersData[username].Text);
                    List<WordWithLevel> UserWords = new List<WordWithLevel>();
                    List<string> Words = new List<string>();
                    Words = UsersData[username].Words;
                    CurrentPhraseIndexes[username] = new HashSet<IndexesData>();

                    foreach (string Word in Words)
                    {
                        UserWords.Add(new WordWithLevel(Word, FindWordLevel(Word)));
                    }

                    for (int i = 0; i < Phrases.Count; i++)
                    {
                        Debug.WriteLine('2');
                        var PhraseWords = Phrases[i].Word.Split(' ');
                        var Indexes = UserWords.Select((WordAndLevel, Index) => new { CurrentWord = WordAndLevel.Word, Index })
                            .Where(WordAndLevel => WordAndLevel.CurrentWord == PhraseWords[0])
                            .Select(Element => Element.Index).ToArray();
                        Debug.WriteLine('3');
                        foreach (int Index in Indexes)
                        {
                            Debug.WriteLine(Index);
                        }

                        int FirstFreeIndexForPhrase = 0;
                        for (int k = 0; k < Indexes.Length; k++)
                        {
                            bool isMultiWordValid = true;
                            for (int j = 1; j < PhraseWords.Length; j++)
                            {
                                try
                                {
                                    isMultiWordValid = UserWords[Indexes[k] + j].Word == PhraseWords[j];
                                }
                                catch
                                {
                                    isMultiWordValid = false;
                                    break;
                                }

                                if (isMultiWordValid == false)
                                {
                                    break;
                                }
                            }
                            Debug.WriteLine('4');

                            if (isMultiWordValid)
                            {
                                if (Indexes[k] < 300)
                                {
                                    var Temporary = UserWords[FirstFreeIndexForPhrase];
                                    UserWords[FirstFreeIndexForPhrase] = Phrases[i];
                                    UserWords[Indexes[k]] = Temporary;
                                    FirstFreeIndexForPhrase++;
                                }
                                UserWords.RemoveRange(Indexes[k] + 1, PhraseWords.Length - 1);
                                CurrentPhraseIndexes[username].Add(new IndexesData(Indexes[k], Phrases[i]));
                            }
                        }
                    }
                    
                    UserTextCompleteData FinalOutput = new UserTextCompleteData(
                        UsersData[username].Title, UsersData[username].Description,
                        UserWords.GetRange(0, 300), UsersData[username].Text, NumberOfPages);
                    return FinalOutput;
                }
            }
            catch (Exception ex)
            {
                return new UserTextCompleteData(ex.Message, "", null, "", 0);
            }
        }

        [HttpPost]
        [Route("api/usertextmanagementcontroller/loadwordproperties")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<WordProperties> LoadWordProperties()
        {
            try
            {
                string JSONWordData = await Request.Content.ReadAsStringAsync();
                JObject WordData = JObject.Parse(JSONWordData);
                string Word = WordData["word"].ToString();
                string WordWithoutChanges = WordData["word"].ToString();
                string Language = WordData["language"].ToString();

                if (Word.Contains(" "))
                {
                    try
                    {
                        int FirstSpaceLocation = Word.IndexOf(" ", StringComparison.Ordinal);
                        string FirstSubWord = Word.Substring(0, FirstSpaceLocation);
                        if (FirstSubWord == "is" || FirstSubWord == "are" || FirstSubWord == "am" || FirstSubWord == "was" ||
                            FirstSubWord == "were" || FirstSubWord == "been")
                        {
                            Word = "be" + Word.Substring(FirstSpaceLocation);
                        }

                        else
                        {
                            string RightSide = Word.Substring(FirstSpaceLocation + 1);
                            Debug.WriteLine(RightSide);

                            string connection = ConfigurationManager.ConnectionStrings["wordsCon"].ConnectionString;
                            SqlConnection con = new SqlConnection(connection);
                            if (con.State == ConnectionState.Closed)
                            {
                                con.Open();
                            }

                            string FindInfinitiveCmd = "SELECT verb FROM PhrasalsForms WHERE rest = @rest AND " +
                                "(past_simple = @verbForm OR past_participle = @verbForm OR third_form = @verbForm OR " +
                                "gerund = @verbForm OR verb = @verbForm)";
                            SqlCommand FindInfinitive = new SqlCommand(FindInfinitiveCmd, con);
                            FindInfinitive.Parameters.AddWithValue("@rest", SqlDbType.NVarChar).Value = RightSide;
                            FindInfinitive.Parameters.AddWithValue("@verbForm", SqlDbType.Char).Value = FirstSubWord;

                            Word = FindInfinitive.ExecuteScalar().ToString() + ' ' + RightSide;
                        }
                    }
                    catch
                    {
                        if (Word.EndsWith("s") && !Word.EndsWith("ss"))
                        {
                            Word = Word.Remove(Word.Length - 1);
                        }
                    }
                }

                WordProperties CurrentWordProperties = await TranslateEngine.GetWordProperties(Word, Language);
                CurrentWordProperties.Word = WordWithoutChanges;
                return CurrentWordProperties;
            }
            catch
            {
                return new WordProperties();
            }
        }

        [HttpPost]
        [Route("api/usertextmanagementcontroller/loadnewpage")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<List<WordWithLevel>> LoadNewPage()
        {
            try
            {
                Debug.WriteLine("Page");
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                string PageNumberString = await Request.Content.ReadAsStringAsync();
                int PageNumber = Int32.Parse(PageNumberString);
                List<WordWithLevel> UserWords = new List<WordWithLevel>();
                List<string> Words = new List<string>();
                int ListIndex = 0;

                if (PageNumber != 0 && PageNumber > 0)
                {
                    ListIndex = (PageNumber - 1) * 300;
                }
                if (UsersData[username].Words.Count < ListIndex + 300)
                {
                    Words = UsersData[username].Words.GetRange(ListIndex, UsersData[username].Words.Count - ListIndex);
                }
                else
                {
                    Words = UsersData[username].Words.GetRange(ListIndex, 300);
                }
                foreach (string Word in Words)
                {
                    UserWords.Add(new WordWithLevel(Word, FindWordLevel(Word)));
                }
                Debug.WriteLine('1');

                var IndexesFromRange = CurrentPhraseIndexes[username].Select((IndexData, i) => IndexData)
                    .Where(IndexData => IndexData.Index >= ListIndex && IndexData.Index < ListIndex + 300)
                    .ToArray();

                int FirstFreeIndexForPhrase = 0;
                for (int i = 0; i < IndexesFromRange.Length; i++)
                {
                    var Temporary = UserWords[FirstFreeIndexForPhrase];
                    UserWords[FirstFreeIndexForPhrase] = IndexesFromRange[i].Phrase;
                    Debug.WriteLine(IndexesFromRange[i].Phrase.Word);
                    UserWords[IndexesFromRange[i].Index % 300] = Temporary;
                    FirstFreeIndexForPhrase++;
                }

                return UserWords;
            }
            catch
            {
                return new List<WordWithLevel>();
            }

        }

        [HttpPost]
        [Route("api/usertextmanagementcontroller/uploadflashcards")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> UploadUserFlashcards()
        {
            try
            {
                List<Flashcard> Flashcards = new List<Flashcard>();
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();

                var JSON_WordParameters = await Request.Content.ReadAsStringAsync();
                var FlashcardData = JObject.Parse(JSON_WordParameters);
                string title = FlashcardData["title"].ToString();
                string description = FlashcardData["description"].ToString();
                bool SaveText = FlashcardData["uploadText"].Value<bool>();
                DateTime CreationDate = FlashcardData["creationTime"].Value<DateTime>();
                if (title.Trim() == "" || title.Length > 100)
                {
                    return "Something went wrong";
                }
                if (description.Trim() == "" || description.Length > 200)
                {
                    return "Something went wrong";
                }
                string titleOriginal = title;
                title = title.Replace(" ", "_");

                foreach(var flashcard in FlashcardData["flashcards"])
                {
                    Flashcard Flashcard = flashcard.ToObject<Flashcard>();
                    if (Flashcard.Word.Trim() == "" || Flashcard.Word.Length > 250)
                    {
                        return "Something went wrong";
                    }
                    if (Flashcard.Meaning.Trim() == "" || Flashcard.Meaning.Length > 500)
                    {
                        return "Something went wrong";
                    }
                    if (!string.IsNullOrEmpty(Flashcard.Synonyms) && Flashcard.Synonyms.Length > 250)
                    {
                        return "Something went wrong";
                    }
                    if (!string.IsNullOrEmpty(Flashcard.Example) && Flashcard.Example.Length > 500)
                    {
                        return "Something went wrong";
                    }
                    if (!string.IsNullOrEmpty(Flashcard.NativeDef) && Flashcard.NativeDef.Length > 250)
                    {
                        return "Something went wrong";
                    }
                    if (!string.IsNullOrEmpty(Flashcard.InContext) && Flashcard.InContext.Length > 750)
                    {
                        return "Something went wrong";
                    }
                    Flashcards.Add(Flashcard);
                }

                if (Flashcards.Count < 3)
                {
                    return "Something went wrong";
                }

                string connectionString = GetUserConnectionString(username);
                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }
                Debug.WriteLine(SaveText);

                string IfTableExistsCmd = @"IF EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES " +
                    "WHERE TABLE_NAME=@title) SELECT 1 ELSE SELECT 0";
                SqlCommand TableCheck = new SqlCommand(IfTableExistsCmd, con);

                TableCheck.Parameters.Add("@title", SqlDbType.NVarChar).Value = title;
                int x = Convert.ToInt32(TableCheck.ExecuteScalar());
                if (x == 1)
                {
                    return "Title Already Exists";
                }

                if (SaveText)
                {
                    string CountRows = "SELECT COUNT(*) FROM dbo.UserTexts";
                    int RowsNumber = 0;
                    SqlCommand CountRowsCommand = new SqlCommand(CountRows, con);
                    RowsNumber = (int)CountRowsCommand.ExecuteScalar();
                    Debug.WriteLine(RowsNumber);

                    if (RowsNumber < 4)
                    {
                        Debug.WriteLine('a');
                        string cmdTextToDB = "INSERT INTO UserTexts " +
                        "(title, description, text, creation_time) values (@title, @description, @text, @creationTime);";
                        SqlCommand SaveTextToDatabase = new SqlCommand(cmdTextToDB, con);

                        if (UsersData[username].Description == "")
                        {
                            SaveTextToDatabase.Parameters.AddWithValue("@description", DBNull.Value);
                        }
                        else
                        {
                            SaveTextToDatabase.Parameters.AddWithValue("@description", SqlDbType.NVarChar)
                                .Value = UsersData[username].Description;
                        }
                        SaveTextToDatabase.Parameters.AddWithValue("@title", SqlDbType.NVarChar)
                            .Value = UsersData[username].Title;
                        SaveTextToDatabase.Parameters.AddWithValue("@text", SqlDbType.NVarChar)
                            .Value = UsersData[username].Text;
                        SaveTextToDatabase.Parameters.AddWithValue("@creationTime", SqlDbType.SmallDateTime)
                            .Value = CreationDate;
                        SaveTextToDatabase.ExecuteNonQuery();
                        Debug.WriteLine('a');
                    }
                    else
                    {
                        return "User Text Limit Exceeded";
                    }
                }
                string cmdFlashcardsOverallInfoToDB = "INSERT INTO UserCollections " +
                    "(title, description, creation_time) values (@title, @description, @creationTime);";
                SqlCommand SaveCollectionInfoToDatabase = new SqlCommand(cmdFlashcardsOverallInfoToDB, con);

                SaveCollectionInfoToDatabase.Parameters.AddWithValue("@title", SqlDbType.NVarChar).Value = titleOriginal;
                SaveCollectionInfoToDatabase.Parameters.AddWithValue
                    ("@description", SqlDbType.NVarChar).Value = description;
                SaveCollectionInfoToDatabase.Parameters.AddWithValue
                    ("@creationTime", SqlDbType.SmallDateTime).Value = CreationDate;

                SaveCollectionInfoToDatabase.ExecuteNonQuery();

                string command = "CREATE TABLE " + title + " (" +
                    "flashcard_id INT NOT NULL IDENTITY(1, 1) PRIMARY KEY," +
                    "word NVARCHAR(250) NOT NULL," +
                    "meaning NVARCHAR(500) NOT NULL," +
                    "synonyms NVARCHAR(250)," +
                    "native_definition NVARCHAR(250)," +
                    "example NVARCHAR(500)," +
                    "in_context_example NVARCHAR(750)," +
                    "is_favourite CHAR(1)," +
                    "progress_level CHAR(1));"; 
                SqlCommand CreateFlashcardsTable = new SqlCommand(command, con);
                CreateFlashcardsTable.ExecuteNonQuery();

                string commandSec = "INSERT INTO " + title + " " +
                "(word, meaning, synonyms, native_definition, example, in_context_example, is_favourite, progress_level) values " +
                "(@word, @meaning, @synonyms, @native_definition, @example, @in_context_example, '0', '0');";
                SqlCommand CreateFlashcards = new SqlCommand(commandSec, con);

                CreateFlashcards.Parameters.AddWithValue("@word", SqlDbType.NVarChar);
                CreateFlashcards.Parameters.AddWithValue("@meaning", SqlDbType.NVarChar);
                CreateFlashcards.Parameters.AddWithValue("@synonyms", SqlDbType.NVarChar);
                CreateFlashcards.Parameters.AddWithValue("@native_definition", SqlDbType.NVarChar);
                CreateFlashcards.Parameters.AddWithValue("@example", SqlDbType.NVarChar);
                CreateFlashcards.Parameters.AddWithValue("@in_context_example", SqlDbType.NVarChar);

                foreach (var flashcard in Flashcards)
                {
                    int counter = 0;
                    foreach (var property in flashcard.GetType().GetProperties())
                    {
                        if (counter < 2)
                        {
                            CreateFlashcards.Parameters[counter].Value = property.GetValue(flashcard);
                        }
                        else
                        {
                            if (property.GetValue(flashcard) == null)
                            {
                                CreateFlashcards.Parameters[counter].Value = DBNull.Value;
                            }
                            else
                            {
                                CreateFlashcards.Parameters[counter].Value = property.GetValue(flashcard);
                            }
                        }
                        counter++;
                    }
                    CreateFlashcards.ExecuteNonQuery();
                }

                con.Close();
                return "Success";
            }
            catch 
            {
                return "Something went wrong";
            }
        }
    }
}
