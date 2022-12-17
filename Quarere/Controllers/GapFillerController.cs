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
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using static Quarere.Classes.ConnectionStringGenerator;
using static Quarere.Classes.SqlOperations;

namespace Quarere.Controllers
{
    public class GapFillerController : ApiController
    {
        [HttpPost]
        [Route("api/gapfillercontroller/getuserdata")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<Queue<GapFiller>> GetUserData()
        {
            try
            {
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                var JSON_GapFillerOptions = await Request.Content.ReadAsStringAsync();
                var GapFillerOptions = JObject.Parse(JSON_GapFillerOptions);

                string CollectionTitle = GapFillerOptions["title"].ToString();
                string GapFillerOption = GapFillerOptions["fillerOption"].ToString();

                if (GapFillerOption == "Example")
                {
                    GapFillerOption = "example";
                }
                else
                {
                    GapFillerOption = "in_context_example";
                }

                string connectionString = GetUserConnectionString(username);
                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }
                Queue<GapFiller> UserData = new Queue<GapFiller>();
                Debug.WriteLine(1);

                if (CheckIfTableExists(CollectionTitle.Replace(' ', '_'), con))
                {
                    string GetUserDataCmd = "SELECT word, " + GapFillerOption + " FROM " + CollectionTitle.Replace(' ', '_');
                    SqlCommand GetUserData = new SqlCommand(GetUserDataCmd, con);
                    using (SqlDataReader rdr = GetUserData.ExecuteReader())
                    {
                        while (rdr.Read())
                        {
                            if (!rdr.IsDBNull(1) && GapFillerOption == "example")
                            {
                                string Word = rdr.GetString(0);
                                string Sentence = rdr.GetString(1);
                                List<int> Indexes = new List<int>();
                                Debug.WriteLine(2);

                                List<string> WordsInSentence = Sentence.Split(' ').ToList<string>();
                                for (int i = 0; i < WordsInSentence.Count; i++)
                                {
                                    if (WordsInSentence[i].ToLower().StartsWith(Word.Substring(0, 1).ToLower()))
                                    {
                                        Indexes.Add(i);
                                    }
                                }
                                Debug.WriteLine(2.5);

                                if (Indexes.Count == 1)
                                {
                                    Regex WordMatchInSentenceRegex = new Regex(WordsInSentence[Indexes[0]], RegexOptions.IgnoreCase);
                                    var Sides = WordMatchInSentenceRegex.Split(Sentence, 2);
                                    GapFiller CurrentGap = new GapFiller(Sides[0].Trim(), WordsInSentence[Indexes[0]], Sides[1].Trim());
                                    UserData.Enqueue(CurrentGap);
                                }
                                else if (Indexes.Count > 1)
                                {
                                    try
                                    {
                                        int substringEnd = 2;
                                        while (Indexes.Count > 1)
                                        {
                                            for (int i = 0; i < Indexes.Count; i++)
                                            {
                                                if (!WordsInSentence[Indexes[i]].StartsWith(Word.Substring(0, substringEnd)))
                                                {
                                                    Indexes.RemoveAt(i);
                                                }
                                            }
                                            substringEnd++;
                                        }
                                        Regex WordMatchInSentenceRegex = new Regex(WordsInSentence[Indexes[0]], RegexOptions.IgnoreCase);
                                        var Sides = WordMatchInSentenceRegex.Split(Sentence, 2);
                                        GapFiller CurrentGap = new GapFiller(Sides[0].Trim(), WordsInSentence[Indexes[0]], Sides[1].Trim());
                                        UserData.Enqueue(CurrentGap);
                                    }
                                    catch
                                    {
                                        //Do nothing
                                    }
                                }
                            }
                            else if (!rdr.IsDBNull(1) && GapFillerOption == "in_context_example")
                            {
                                string Word = rdr.GetString(0);
                                string Sentence = rdr.GetString(1);

                                Regex WordMatchInSentenceRegex = new Regex(Word, RegexOptions.IgnoreCase);
                                if (WordMatchInSentenceRegex.IsMatch(Sentence))
                                {
                                    Match TargetWord = WordMatchInSentenceRegex.Match(Sentence);
                                    var Sides = Sentence.Split(new[] { TargetWord.Value }, StringSplitOptions.None);
                                    GapFiller CurrentGap = new GapFiller(Sides[0].Trim(), TargetWord.Value, Sides[1].Trim());
                                    UserData.Enqueue(CurrentGap);
                                }
                            }
                        }
                    }

                    con.Close();
                    return UserData;
                }

                con.Close();
                return new Queue<GapFiller>();
            }
            catch
            {
                return new Queue<GapFiller>();
            }
        }
    }
}
