using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using static Quarere.Classes.SqlOperations;
using static Quarere.Classes.ConnectionStringGenerator;
using Quarere.Classes;
using Quarere.Cors;
using System.Threading.Tasks;
using System.Data;
using Quarere.Models;
using System.Threading;
using System.Data.SqlClient;
using Newtonsoft.Json.Linq;
using System.Diagnostics;

namespace Quarere.Controllers
{
    public class ProgressTrackerController : ApiController
    {
        [HttpPut]
        [Route("api/progresstrackercontroller/changeelementprogresslevel")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> ChangeElementProgressLevel()
        {
            try
            {
                var JSON_UpdateData = await Request.Content.ReadAsStringAsync();
                var UpdateData = JObject.Parse(JSON_UpdateData);
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                string connectionString = GetUserConnectionString(username);

                string DbTitle = UpdateData["title"].ToString().Replace(' ', '_');
                string Word = UpdateData["word"].ToString();
                string Meaning = UpdateData["meaning"].ToString();
                string ActionType = UpdateData["actionType"].ToString();

                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                if (CheckIfTableExists(DbTitle, con))
                {
                    string GetCurrentElementProgressCmd = "SELECT progress_level FROM " + DbTitle +
                        " WHERE word = @wordOrPhrase AND meaning = @meaning";
                    SqlCommand GetCurrentElementProgress = new SqlCommand(GetCurrentElementProgressCmd, con);

                    GetCurrentElementProgress.Parameters.AddWithValue("@wordOrPhrase", SqlDbType.NVarChar).Value = Word;
                    GetCurrentElementProgress.Parameters.AddWithValue("@meaning", SqlDbType.NVarChar).Value = Meaning;

                    int CurrentProgressLevel = Int32.Parse(GetCurrentElementProgress.ExecuteScalar().ToString());

                    if (ActionType == "Increase" && CurrentProgressLevel < 4)
                    {
                        if (CurrentProgressLevel == 0)
                        {
                            CurrentProgressLevel = 2;
                        }
                        else
                        {
                            CurrentProgressLevel++;
                        }
                    }
                    else if (ActionType == "Decrease" && CurrentProgressLevel > 1 || ActionType == "Decrease" && CurrentProgressLevel == 0)
                    {
                        if (CurrentProgressLevel == 0)
                        {
                            CurrentProgressLevel = 1;
                        }
                        else
                        {
                            CurrentProgressLevel--;
                        }
                    }

                    string UpdateProgressLevelCmd = "UPDATE " + DbTitle + " SET progress_level = @newProgressLevelValue " +
                            "WHERE word = @wordOrPhrase OR meaning = @meaning";
                    SqlCommand UpdateProgressLevel = new SqlCommand(UpdateProgressLevelCmd, con);

                    UpdateProgressLevel.Parameters.AddWithValue("@wordOrPhrase", SqlDbType.NVarChar).Value = Word;
                    UpdateProgressLevel.Parameters.AddWithValue("@meaning", SqlDbType.NVarChar).Value = Meaning;
                    UpdateProgressLevel.Parameters.AddWithValue("@newProgressLevelValue", SqlDbType.Char).Value = 
                        Char.Parse(CurrentProgressLevel.ToString());

                    UpdateProgressLevel.ExecuteNonQuery();

                    return "Success";
                }

                return "Error";
            }
            catch
            {
                return "Error";
            }
        }

        [HttpPut]
        [Route("api/progresstrackercontroller/updateprogresslevelbyuser")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> UpdateManuallyElementProgressLevel()
        {
            try
            {
                var JSON_UpdateData = await Request.Content.ReadAsStringAsync();
                var UpdateData = JObject.Parse(JSON_UpdateData);
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                string connectionString = GetUserConnectionString(username);

                Debug.WriteLine(1);

                string DbTitle = UpdateData["title"].ToString().Replace(' ', '_');
                string Word = UpdateData["word"].ToString();
                string Meaning = UpdateData["meaning"].ToString();
                char NewLevel = Char.Parse(UpdateData["newValue"].ToString());

                Debug.WriteLine(Word);
                Debug.WriteLine(Meaning);
                Debug.WriteLine(NewLevel);

                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                string UpdateProgressLevelCmd = "UPDATE " + DbTitle + " SET progress_level = @newProgressLevelValue " +
                            "WHERE word = @wordOrPhrase AND meaning = @meaning";
                SqlCommand UpdateProgressLevel = new SqlCommand(UpdateProgressLevelCmd, con);

                UpdateProgressLevel.Parameters.AddWithValue("@wordOrPhrase", SqlDbType.NVarChar).Value = Word;
                UpdateProgressLevel.Parameters.AddWithValue("@meaning", SqlDbType.NVarChar).Value = Meaning;
                UpdateProgressLevel.Parameters.AddWithValue("@newProgressLevelValue", SqlDbType.Char).Value = NewLevel;

                UpdateProgressLevel.ExecuteNonQuery();

                return "Success";
            }
            catch 
            {
                return "Error";
            }
        }
    }
}
