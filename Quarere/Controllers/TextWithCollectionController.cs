using Quarere.Classes;
using Quarere.Cors;
using Quarere.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using static Quarere.Classes.SqlOperations;
using static Quarere.Classes.ConnectionStringGenerator;
using System.Reflection;
using System.Diagnostics;
using Newtonsoft.Json.Linq;

namespace Quarere.Controllers
{
    public class TextWithCollectionController : ApiController
    {
        static Queue<Flashcard> CurrentCollectionFlashcards = new Queue<Flashcard>();

        [HttpPost]
        [Route("api/textwithcollectioncontroller/loadusercollection")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> LoadUserCollection()
        {
            try
            {
                CurrentCollectionFlashcards.Clear();
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                string Title = await Request.Content.ReadAsStringAsync();
                string connectionString = GetUserConnectionString(username);
                string DbTitle = Title.Replace(' ', '_');

                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                if (CheckIfTableExists(DbTitle, con))
                {
                    string GetAllFlashcardsCmd = "SELECT word, meaning, synonyms, native_definition, example," +
                        " in_context_example FROM " + DbTitle + ";";
                    SqlCommand GetAllFlashcards = new SqlCommand(GetAllFlashcardsCmd, con);
                    Debug.WriteLine('b');
                    using (SqlDataReader rdr = GetAllFlashcards.ExecuteReader())
                    {
                        while (rdr.Read())
                        {
                            Queue<string> FlashcardProperties = new Queue<string>();
                            Flashcard CurrentFlashcard = new Flashcard();
                            for (int i = 0; i < 6; i++)
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

                            foreach (PropertyInfo prop in CurrentFlashcard.GetType().GetProperties())
                            {
                                string temp = FlashcardProperties.Dequeue();
                                Debug.WriteLine('a');
                                Debug.WriteLine(temp);
                                prop.SetValue(CurrentFlashcard, temp);
                            }
                            CurrentCollectionFlashcards.Enqueue(CurrentFlashcard);
                        }
                        con.Close();
                        return "Success";
                    }
                }

                con.Close();
                return "Error";
            }
            catch
            {
                return "Error";
            }
        }

        [HttpGet]
        [Route("api/textwithcollectioncontroller/getusercollection")]
        [BasicAuthentication]
        [AllowCrossSite]
        public Queue<Flashcard> GetUserCollection()
        {
            return CurrentCollectionFlashcards;
        }

        [HttpPut]
        [Route("api/textwithcollectioncontroller/updateusercollection")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> UpdateUserCollection()
        {
            try
            {
                var JSON_UpdateData = await Request.Content.ReadAsStringAsync();
                var UpdateData = JObject.Parse(JSON_UpdateData);
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                string connectionString = GetUserConnectionString(username);
                string DbTitle = UpdateData["collectionTitle"].ToString().Replace(' ', '_');
                Queue<FlashcardExtended> OldFlashcardList = new Queue<FlashcardExtended>();
                Queue<FlashcardExtended> NewFlashcardList = new Queue<FlashcardExtended>();

                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                Debug.WriteLine("non");

                if (CheckIfTableExists(DbTitle, con)) 
                {
                    string GetAllOldFlashcardsCmd = "SELECT * FROM " + DbTitle + ";";
                    SqlCommand GetAllOldFlashcards = new SqlCommand(GetAllOldFlashcardsCmd, con);
                    using (SqlDataReader rdr = GetAllOldFlashcards.ExecuteReader())
                    {
                        while (rdr.Read())
                        {
                            Queue<string> FlashcardProperties = new Queue<string>();
                            FlashcardExtended CurrentFlashcard = new FlashcardExtended();
                            for (int i = 1; i < 9; i++)
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

                            foreach (PropertyInfo prop in CurrentFlashcard.GetType().GetProperties())
                            {
                                string temp = FlashcardProperties.Dequeue();
                                prop.SetValue(CurrentFlashcard, temp);
                            }
                            OldFlashcardList.Enqueue(CurrentFlashcard);
                        }
                    }
                    Debug.WriteLine('a');

                    foreach (var flashcard in UpdateData["flashcards"])
                    {
                        FlashcardExtended Flashcard = flashcard.ToObject<FlashcardExtended>();
                        if (Flashcard.Word.Trim() == "" || Flashcard.Word.Length > 250)
                        {
                            con.Close();
                            return "Something went wrong";
                        }
                        if (Flashcard.Meaning.Trim() == "" || Flashcard.Meaning.Length > 500)
                        {
                            con.Close();
                            return "Something went wrong";
                        }
                        if (!string.IsNullOrEmpty(Flashcard.Synonyms) && Flashcard.Synonyms.Length > 250)
                        {
                            con.Close();
                            return "Something went wrong";
                        }
                        if (!string.IsNullOrEmpty(Flashcard.Example) && Flashcard.Example.Length > 500)
                        {
                            con.Close();
                            return "Something went wrong";
                        }
                        if (!string.IsNullOrEmpty(Flashcard.NativeDef) && Flashcard.NativeDef.Length > 250)
                        {
                            con.Close();
                            return "Something went wrong";
                        }
                        if (!string.IsNullOrEmpty(Flashcard.InContext) && Flashcard.InContext.Length > 750)
                        {
                            con.Close();
                            return "Something went wrong";
                        }
                        Flashcard.IsFavourite = "0";
                        Flashcard.ProgressLevel = "0";
                        NewFlashcardList.Enqueue(Flashcard);
                    }

                    if (NewFlashcardList.Count < 3)
                    {
                        return "Something went wrong";
                    }

                    foreach (var NewFlashcard in NewFlashcardList)
                    {
                        foreach (var OldFlashcard in OldFlashcardList)
                        {
                            if (NewFlashcard.Word == OldFlashcard.Word && NewFlashcard.Meaning == OldFlashcard.Meaning)
                            {
                                NewFlashcard.IsFavourite = OldFlashcard.IsFavourite;
                                NewFlashcard.ProgressLevel = OldFlashcard.ProgressLevel;
                            }
                        }
                    }

                    string ClearTableCmd = "TRUNCATE TABLE " + DbTitle + ";";
                    SqlCommand ClearTable = new SqlCommand(ClearTableCmd, con);
                    ClearTable.ExecuteNonQuery();

                    string UpdateFlashcardsCmd = "INSERT INTO " + DbTitle + " " +
                    "(word, meaning, synonyms, native_definition, example, in_context_example, is_favourite, progress_level) values " +
                    "(@word, @meaning, @synonyms, @native_definition, @example, @in_context_example, @isFav, @progress);";
                    SqlCommand UpdateFlashcards = new SqlCommand(UpdateFlashcardsCmd, con);

                    UpdateFlashcards.Parameters.AddWithValue("@word", SqlDbType.NVarChar);
                    UpdateFlashcards.Parameters.AddWithValue("@meaning", SqlDbType.NVarChar);
                    UpdateFlashcards.Parameters.AddWithValue("@synonyms", SqlDbType.NVarChar);
                    UpdateFlashcards.Parameters.AddWithValue("@native_definition", SqlDbType.NVarChar);
                    UpdateFlashcards.Parameters.AddWithValue("@example", SqlDbType.NVarChar);
                    UpdateFlashcards.Parameters.AddWithValue("@in_context_example", SqlDbType.NVarChar);
                    UpdateFlashcards.Parameters.AddWithValue("@isFav", SqlDbType.Char);
                    UpdateFlashcards.Parameters.AddWithValue("@progress", SqlDbType.Char);

                    Debug.WriteLine('c');

                    foreach (var NewFlashcard in NewFlashcardList)
                    {
                        int counter = 0;
                        foreach (var property in NewFlashcard.GetType().GetProperties())
                        {
                            if (counter < 2)
                            {
                                UpdateFlashcards.Parameters[counter].Value = property.GetValue(NewFlashcard);
                            }
                            else
                            {
                                if (property.GetValue(NewFlashcard) == null)
                                {
                                    UpdateFlashcards.Parameters[counter].Value = DBNull.Value;
                                }
                                else
                                {
                                    UpdateFlashcards.Parameters[counter].Value = property.GetValue(NewFlashcard);
                                }
                            }
                            counter++;
                        }
                        UpdateFlashcards.ExecuteNonQuery();
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
    }
}
