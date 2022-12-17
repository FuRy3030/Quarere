using Newtonsoft.Json.Linq;
using Quarere.Classes;
using Quarere.Cors;
using Quarere.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using static Quarere.Classes.ConnectionStringGenerator;
using static Quarere.Classes.SqlOperations;

namespace Quarere.Controllers
{
    public class UserCollectionManagementController : ApiController
    {
        [HttpPost]
        [Route("api/usercollectionmanagementcontroller/getallcollections")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<ColectionFullData> GetAllCollections()
        {
            try
            {
                var JSON_CollectionPointer = await Request.Content.ReadAsStringAsync();
                var CollectionPointer = JObject.Parse(JSON_CollectionPointer);
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                string connectionString = GetUserConnectionString(username);
                string ProperTitle = CollectionPointer["title"].ToString().Replace(' ', '_');
                ColectionFullData ReturnValue = new ColectionFullData();
                Debug.WriteLine("error");
                Debug.WriteLine(ProperTitle);

                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                string GetGeneralCollectionDataCmd = "SELECT title, description, creation_time FROM UserCollections " +
                    "WHERE title = @title;";
                SqlCommand GetGeneralCollectionData = new SqlCommand(GetGeneralCollectionDataCmd, con);
                GetGeneralCollectionData.Parameters.AddWithValue("@title", SqlDbType.NVarChar)
                    .Value = CollectionPointer["title"].ToString();
                using (SqlDataReader rdr = GetGeneralCollectionData.ExecuteReader())
                {
                    while (rdr.Read())
                    {
                        if (rdr.IsDBNull(1))
                        {
                            UserCollectionGeneral CollectionGeneralInfo = new UserCollectionGeneral
                                (rdr.GetString(0), "", rdr.GetDateTime(2));
                            ReturnValue.GeneralData = CollectionGeneralInfo;
                        }
                        else
                        {
                            UserCollectionGeneral CollectionGeneralInfo = new UserCollectionGeneral
                                (rdr.GetString(0), rdr.GetString(1), rdr.GetDateTime(2));
                            ReturnValue.GeneralData = CollectionGeneralInfo;
                        }
                    }
                }
                Debug.WriteLine("error");

                if (CheckIfTableExists(ProperTitle, con))
                {
                    string GetRowsNumberCmd = "SELECT COUNT(*) FROM " + ProperTitle;
                    SqlCommand GetRowsNumber = new SqlCommand(GetRowsNumberCmd, con);
                    ReturnValue.GeneralData.TermsCount = (int)GetRowsNumber.ExecuteScalar();

                    string SelectAllFlashcardsCmd = "SELECT word, meaning, synonyms, native_definition, example, " +
                        "in_context_example, is_favourite, progress_level FROM " + ProperTitle + ";";
                    SqlCommand SelectAllFlashcards = new SqlCommand(SelectAllFlashcardsCmd, con);
                    Queue<FlashcardExtended> Flashcards = new Queue<FlashcardExtended>();
                    Debug.WriteLine("error");
                    using (SqlDataReader rdr = SelectAllFlashcards.ExecuteReader())
                    {
                        while (rdr.Read())
                        {
                            Queue<string> FlashcardProperties = new Queue<string>();
                            FlashcardExtended CurrentFlashcard = new FlashcardExtended();
                            for (int i = 0; i < 8; i++)
                            {
                                if (rdr.IsDBNull(i))
                                {
                                    FlashcardProperties.Enqueue("");
                                }
                                else
                                {
                                    FlashcardProperties.Enqueue(rdr.GetString(i));
                                }
                            }
                            Debug.WriteLine("a");

                            foreach (PropertyInfo prop in CurrentFlashcard.GetType().GetProperties())
                            {
                                string temp = FlashcardProperties.Dequeue();
                                prop.SetValue(CurrentFlashcard, temp);
                            }
                            Flashcards.Enqueue(CurrentFlashcard);
                        }
                    }
                    ReturnValue.Flashcards = Flashcards;
                }

                con.Close();
                return ReturnValue;
            }
            catch
            {
                return new ColectionFullData();
            }
        }

        [HttpPut]
        [Route("api/usercollectionmanagementcontroller/updateflashcardfield")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> UpdateFlashcardField()
        {
            try
            {
                var JSON_UpdateInfo = await Request.Content.ReadAsStringAsync();
                var UpdateInfo = JObject.Parse(JSON_UpdateInfo);
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                string connectionString = GetUserConnectionString(username);
                string ProperTitle = UpdateInfo["title"].ToString().Replace(' ', '_');

                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                int FlashcardID = 0;
                if (CheckIfTableExists(ProperTitle, con))
                {
                    int FlashcardOrder = Int32.Parse(UpdateInfo["flashcardOrder"].ToString());
                    Debug.WriteLine(FlashcardOrder);
                    string FindFlashcardIDCmd = "SELECT * FROM (SELECT ROW_NUMBER() OVER(ORDER BY word ASC) " +
                    "AS rownumber, flashcard_id FROM dbo." + ProperTitle + ") AS foo WHERE rownumber = @flashcardOrder;";
                    SqlCommand FindFlashcardID = new SqlCommand(FindFlashcardIDCmd, con);
                    FindFlashcardID.Parameters.AddWithValue("@flashcardOrder", SqlDbType.Int).Value = FlashcardOrder;
                    using (SqlDataReader rdr = FindFlashcardID.ExecuteReader())
                    {
                        while (rdr.Read())
                        {
                            FlashcardID = rdr.GetInt32(1);
                        }
                    }

                    Debug.WriteLine(FlashcardID);
                    string FiledToUpdate = UpdateInfo["element"].ToString();
                    string NewValue = UpdateInfo["newValue"].ToString();
                    if (FiledToUpdate == "word" || FiledToUpdate == "meaning" || FiledToUpdate == "synonyms" || 
                        FiledToUpdate == "example" || FiledToUpdate == "native_definition" || 
                        FiledToUpdate == "in_context_example")
                    {
                        string UpdateFieldCmd = "UPDATE " + ProperTitle + " SET " + FiledToUpdate + " = @value " +
                            "WHERE flashcard_id = @flashcardID";
                        SqlCommand UpdateField = new SqlCommand(UpdateFieldCmd, con);
                        UpdateField.Parameters.AddWithValue("@value", SqlDbType.NVarChar).Value = NewValue;
                        UpdateField.Parameters.AddWithValue("@flashcardID", SqlDbType.Int).Value = FlashcardID;
                        UpdateField.ExecuteNonQuery();
                    }
                }

                con.Close();
                return "Success";
            }
            catch
            {
                return "Error";
            }
        }

        [HttpPut]
        [Route("api/usercollectionmanagementcontroller/updatecollectioninfo")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> UpdateCollectionInfo()
        {
            try
            {
                var JSON_UpdateInfo = await Request.Content.ReadAsStringAsync();
                var UpdateInfo = JObject.Parse(JSON_UpdateInfo);
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                string connectionString = GetUserConnectionString(username);

                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                if (UpdateInfo["element"].ToString() == "title")
                {
                    string UpdateTitleCmd = "UPDATE UserCollections SET title = @newTitle " +
                            "WHERE title = @title";
                    SqlCommand UpdateTitle = new SqlCommand(UpdateTitleCmd, con);
                    UpdateTitle.Parameters.AddWithValue("@newTitle", SqlDbType.NVarChar).Value =
                        UpdateInfo["newValue"].ToString();
                    UpdateTitle.Parameters.AddWithValue("@title", SqlDbType.NVarChar).Value =
                        UpdateInfo["title"].ToString();
                    UpdateTitle.ExecuteNonQuery();
                    Debug.WriteLine('c');

                    string ProperOldTitle = UpdateInfo["title"].ToString().Replace(' ', '_');
                    string ProperNewTitle = UpdateInfo["newValue"].ToString().Replace(' ', '_');
                    string UpdateTableNameCmd = "EXEC sp_rename @oldName, @newName";
                    SqlCommand UpdateTableName = new SqlCommand(UpdateTableNameCmd, con);
                    UpdateTableName.Parameters.AddWithValue("@oldName", SqlDbType.NVarChar).Value = ProperOldTitle;
                    UpdateTableName.Parameters.AddWithValue("@newName", SqlDbType.NVarChar).Value = ProperNewTitle;
                    UpdateTableName.ExecuteNonQuery();
                }
                else
                {
                    string UpdateDescriptionCmd = "UPDATE UserCollections SET description = @newDescription " +
                            "WHERE title = @title";
                    SqlCommand UpdateDescription = new SqlCommand(UpdateDescriptionCmd, con);
                    UpdateDescription.Parameters.AddWithValue("@newDescription", SqlDbType.NVarChar).Value = 
                        UpdateInfo["newValue"].ToString();
                    UpdateDescription.Parameters.AddWithValue("@title", SqlDbType.NVarChar).Value =
                        UpdateInfo["title"].ToString();
                    UpdateDescription.ExecuteNonQuery();
                }

                con.Close();
                return "Success";
            }
            catch
            {
                return "Error";
            }
        }

        [HttpPut]
        [Route("api/usercollectionmanagementcontroller/updatefavourites")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> UpdateFavourite()
        {
            try
            {
                var JSON_UpdateFavouritesInfo = await Request.Content.ReadAsStringAsync();
                var UpdateFavouritesInfo = JObject.Parse(JSON_UpdateFavouritesInfo);
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                string connectionString = GetUserConnectionString(username);
                string ProperTitle = UpdateFavouritesInfo["title"].ToString().Replace(' ', '_');
                Debug.WriteLine("Favourite");

                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                if (CheckIfTableExists(ProperTitle, con))
                {
                    string UpdateFlashcardCmd = "UPDATE " + ProperTitle + " SET is_favourite = @isFavourite" +
                        " WHERE word = @word AND meaning = @meaning;";
                    SqlCommand UpdateFlashcard = new SqlCommand(UpdateFlashcardCmd, con);
                    UpdateFlashcard.Parameters.AddWithValue("@word", SqlDbType.NVarChar)
                        .Value = UpdateFavouritesInfo["word"].ToString();
                    UpdateFlashcard.Parameters.AddWithValue("@meaning", SqlDbType.NVarChar)
                        .Value = UpdateFavouritesInfo["meaning"].ToString();
                    Debug.WriteLine("Error");
                    if (UpdateFavouritesInfo["action"].ToString() == "makeFavourite")
                    {
                        UpdateFlashcard.Parameters.AddWithValue("@isFavourite", SqlDbType.Char)
                            .Value = "1";
                    }
                    else
                    {
                        UpdateFlashcard.Parameters.AddWithValue("@isFavourite", SqlDbType.Char)
                            .Value = "0";
                    }
                    UpdateFlashcard.ExecuteNonQuery();

                    con.Close();
                    return "Success";
                }

                con.Close();
                return "Success";
            }
            catch
            {
                return "Error";
            }
        }

        [HttpDelete]
        [Route("api/usercollectionmanagementcontroller/deleteflashcard")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> DeleteFlashcard()
        {
            try
            {
                var JSON_DeleteInfo = await Request.Content.ReadAsStringAsync();
                var DeleteInfo = JObject.Parse(JSON_DeleteInfo);
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                string connectionString = GetUserConnectionString(username);
                string ProperTitle = DeleteInfo["title"].ToString().Replace(' ', '_');

                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                if (CheckIfTableExists(ProperTitle, con))
                {
                    string CountRowsCmd = "SELECT COUNT(*) FROM " + ProperTitle;
                    SqlCommand CountRows = new SqlCommand(CountRowsCmd, con);
                    int NumberOfRows = (int)CountRows.ExecuteScalar();
                     
                    if (NumberOfRows < 4)
                    {
                        con.Close();
                        return "Not Enough Flashcards";
                    }
                    else
                    {
                        string DeleteFlashcardCmd = "DELETE FROM " + ProperTitle + " WHERE word = @word AND " +
                        "meaning = @meaning;";
                        SqlCommand DeleteFlashcard = new SqlCommand(DeleteFlashcardCmd, con);
                        DeleteFlashcard.Parameters.AddWithValue("@word", SqlDbType.NVarChar)
                            .Value = DeleteInfo["word"].ToString();
                        DeleteFlashcard.Parameters.AddWithValue("@meaning", SqlDbType.NVarChar)
                            .Value = DeleteInfo["meaning"].ToString();
                        DeleteFlashcard.ExecuteNonQuery();
                    }

                    con.Close();
                    return "Success";
                }
                con.Close();
                return "Error";
            }
            catch
            {
                return "Error";
            }
        }

        [HttpPost]
        [Route("api/usercollectionmanagementcontroller/addnewflashcard")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> AddNewFlashcard()
        {
            try
            {
                var JSON_AddNewElement = await Request.Content.ReadAsStringAsync();
                var AddNewElement = JObject.Parse(JSON_AddNewElement);
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                string connectionString = GetUserConnectionString(username);
                string ProperTitle = AddNewElement["title"].ToString().Replace(' ', '_');

                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                Flashcard Flashcard = AddNewElement["flashcard"].ToObject<Flashcard>();
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

                if (CheckIfTableExists(ProperTitle, con))
                {
                    string commandSec = "INSERT INTO " + ProperTitle + " " +
                    "(word, meaning, synonyms, native_definition, example, in_context_example, is_favourite, progress_level) values " +
                    "(@word, @meaning, @synonyms, @native_definition, @example, @in_context_example, '0', '0');";
                    SqlCommand CreateFlashcards = new SqlCommand(commandSec, con);

                    CreateFlashcards.Parameters.AddWithValue("@word", SqlDbType.NVarChar);
                    CreateFlashcards.Parameters.AddWithValue("@meaning", SqlDbType.NVarChar);
                    CreateFlashcards.Parameters.AddWithValue("@synonyms", SqlDbType.NVarChar);
                    CreateFlashcards.Parameters.AddWithValue("@native_definition", SqlDbType.NVarChar);
                    CreateFlashcards.Parameters.AddWithValue("@example", SqlDbType.NVarChar);
                    CreateFlashcards.Parameters.AddWithValue("@in_context_example", SqlDbType.NVarChar);

                    int counter = 0;
                    foreach (var property in Flashcard.GetType().GetProperties())
                    {
                        if (counter < 2)
                        {
                            CreateFlashcards.Parameters[counter].Value = property.GetValue(Flashcard);
                        }
                        else
                        {
                            if (property.GetValue(Flashcard) == "")
                            {
                                CreateFlashcards.Parameters[counter].Value = DBNull.Value;
                            }
                            else
                            {
                                CreateFlashcards.Parameters[counter].Value = property.GetValue(Flashcard);
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
                return "Error";
            }
        }

        [HttpGet]
        [Route("api/usercollectionmanagementcontroller/gettexts")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<Queue<string>> GetTexts()
        {
            try
            {
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                string connectionString = GetUserConnectionString(username);
                Queue<string> TextTitles = new Queue<string>();

                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                string GetTextsCmd = "SELECT title FROM UserTexts;";
                SqlCommand GetTexts = new SqlCommand(GetTextsCmd, con);
                using (SqlDataReader rdr = GetTexts.ExecuteReader())
                {
                    while (rdr.Read())
                    {
                        TextTitles.Enqueue(rdr.GetString(0));
                    }
                }

                con.Close();
                return TextTitles;
            }
            catch
            {
                return new Queue<string>();
            }
        }
    }
}
