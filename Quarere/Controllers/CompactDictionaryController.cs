using Newtonsoft.Json.Linq;
using Quarere.Classes;
using Quarere.Cors;
using Quarere.Models;
using Quarere.Translate_Engine;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Quarere.Controllers
{
    public class CompactDictionaryController : ApiController
    {
        string UsersConnection = ConfigurationManager.ConnectionStrings["users"].ConnectionString;

        [HttpPost]
        [Route("api/compactdictionarycontroller/loaddictionarydata")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<CompactDictionaryEntity> LoadDictionaryData()
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

                    Debug.WriteLine(Word);
                    CompactDictionaryEntity CurrentWordProperties = await TranslateEngine.GetDictionaryDataLongWord(Word);
                    CurrentWordProperties.Word = WordWithoutChanges;
                    return CurrentWordProperties;
                }
                else
                {
                    CompactDictionaryEntity CurrentWordProperties = await TranslateEngine.GetDictionaryData(Word, Language);
                    CurrentWordProperties.Word = WordWithoutChanges;
                    return CurrentWordProperties;
                }
            }
            catch
            {
                return new CompactDictionaryEntity();
            }
        }

        [HttpPut]
        [Route("api/compactdictionarycontroller/updatesettings")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> UpdateUserSettings()
        {
            string JSONNewUserSettings = await Request.Content.ReadAsStringAsync();
            JObject NewUserSettings = JObject.Parse(JSONNewUserSettings);
            string Username = NewUserSettings["username"].ToString();
            int NewMaxExamples = Int32.Parse(NewUserSettings["examplesSettings"].ToString());
            int NewMaxSynonyms = Int32.Parse(NewUserSettings["synonymsSettings"].ToString());
            int NewMaxSenses = Int32.Parse(NewUserSettings["sensesSettings"].ToString());

            SqlConnection con = new SqlConnection(UsersConnection);
            if (con.State == ConnectionState.Closed)
            {
                con.Open();
            }

            string UpdateUserSettingsCmd = "UPDATE DictionaryConfig SET examples = @maxExamples, synonyms = @maxSynonyms, " +
                "senses = @maxSenses WHERE username = @username";
            SqlCommand UpdateUserSettings = new SqlCommand(UpdateUserSettingsCmd, con);
            UpdateUserSettings.Parameters.AddWithValue("@maxExamples", SqlDbType.SmallInt).Value = NewMaxExamples;
            UpdateUserSettings.Parameters.AddWithValue("@maxSynonyms", SqlDbType.SmallInt).Value = NewMaxSynonyms;
            UpdateUserSettings.Parameters.AddWithValue("@maxSenses", SqlDbType.SmallInt).Value = NewMaxSenses;
            UpdateUserSettings.Parameters.AddWithValue("@username", SqlDbType.NVarChar).Value = Username;
            UpdateUserSettings.ExecuteNonQuery();

            con.Close();
            return "Success";
        }

        [HttpPost]
        [Route("api/compactdictionarycontroller/getsettings")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<DictionarySettings> GetUserSettings()
        {
            DictionarySettings CurrentSettings = null;
            string Username = await Request.Content.ReadAsStringAsync();

            SqlConnection con = new SqlConnection(UsersConnection);
            if (con.State == ConnectionState.Closed)
            {
                con.Open();
            }

            string GetUserSettingsCmd = "SELECT examples, synonyms, senses FROM DictionaryConfig WHERE username = @username";
            SqlCommand GetUserSettings = new SqlCommand(GetUserSettingsCmd, con);
            GetUserSettings.Parameters.AddWithValue("@username", SqlDbType.NVarChar).Value = Username;

            using (SqlDataReader rdr = GetUserSettings.ExecuteReader())
            {
                while (rdr.Read())
                {
                    CurrentSettings = new DictionarySettings(rdr.GetInt16(0), rdr.GetInt16(1), rdr.GetInt16(2));
                }
            }

            con.Close();
            return CurrentSettings;
        }
    }
}
