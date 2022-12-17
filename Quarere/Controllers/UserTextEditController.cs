using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using static Quarere.Classes.SqlOperations;
using static Quarere.Classes.ConnectionStringGenerator;
using System.Reflection;
using System.Diagnostics;
using Newtonsoft.Json.Linq;
using Quarere.Cors;
using Quarere.Classes;
using System.Threading.Tasks;
using Quarere.Models;
using System.Threading;
using System.Data.SqlClient;
using System.Data;

namespace Quarere.Controllers
{
    public class UserTextEditController : ApiController
    {
        [HttpPost]
        [Route("api/usertexteditcontroller/getusertext")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<TextEditData> GetUserTextData()
        {
            try
            {
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                string connectionString = GetUserConnectionString(username);
                string SelectedTitle = await Request.Content.ReadAsStringAsync();
                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                string GetTextDataCmd = "SELECT title, description, text FROM UserTexts WHERE title = @title";
                SqlCommand GetTextData = new SqlCommand(GetTextDataCmd, con);
                GetTextData.Parameters.AddWithValue("@title", SqlDbType.NVarChar).Value = SelectedTitle;
                using (SqlDataReader rdr = GetTextData.ExecuteReader())
                {
                    while (rdr.Read())
                    {
                        if (rdr.IsDBNull(1))
                        {
                            TextEditData ReturnData = new TextEditData(rdr.GetString(0), "", rdr.GetString(2));
                            con.Close();
                            return ReturnData;
                        }
                        else
                        {
                            TextEditData ReturnData = new TextEditData
                                (rdr.GetString(0), rdr.GetString(1), rdr.GetString(2));
                            con.Close();
                            return ReturnData;
                        }
                    }
                }
                con.Close();
                return new TextEditData();
            }
            catch
            {
                return new TextEditData();
            }
        }

        [HttpGet]
        [Route("api/usertexteditcontroller/getusercollections")]
        [BasicAuthentication]
        [AllowCrossSite]
        public Queue<string> GetCollections()
        {
            try
            {
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                string connectionString = GetUserConnectionString(username);
                Queue<string> CollectionTitles = new Queue<string>();

                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                string GetCollectionsCmd = "SELECT title FROM UserCollections;";
                SqlCommand GetCollections = new SqlCommand(GetCollectionsCmd, con);
                using (SqlDataReader rdr = GetCollections.ExecuteReader())
                {
                    while (rdr.Read())
                    {
                        CollectionTitles.Enqueue(rdr.GetString(0));
                    }
                }

                con.Close();
                return CollectionTitles;
            }
            catch
            {
                return new Queue<string>();
            }
        }

        [HttpPut]
        [Route("api/usertexteditcontroller/updatetexttitle")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> UpdateTextTitle()
        {
            try
            {
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                string connectionString = GetUserConnectionString(username);
                string JSON_TitleData = await Request.Content.ReadAsStringAsync();
                JObject TitleData = JObject.Parse(JSON_TitleData);

                if (TitleData["newTitle"].ToString().Length > 100)
                {
                    return "Error";
                }

                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                if (CheckIfTextTitleExists(TitleData["newTitle"].ToString(), con) == false)
                {
                    string UpdateTitleCmd = "UPDATE UserTexts SET title = @newTitle WHERE title = @oldTitle";
                    SqlCommand UpdateTitle = new SqlCommand(UpdateTitleCmd, con);
                    UpdateTitle.Parameters.AddWithValue("@newTitle", SqlDbType.NVarChar).Value = 
                        TitleData["newTitle"].ToString();
                    UpdateTitle.Parameters.AddWithValue("@oldTitle", SqlDbType.NVarChar).Value =
                       TitleData["oldTitle"].ToString();
                    UpdateTitle.ExecuteNonQuery();

                    con.Close();
                    return "Success";
                }
                else
                {
                    con.Close();
                    return "Already Exists";
                }
            }
            catch
            {
                return "Error";
            }
        }

        [HttpPut]
        [Route("api/usertexteditcontroller/updatetextdescription")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> UpdateTextDescription()
        {
            try
            {
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                string connectionString = GetUserConnectionString(username);
                string JSON_DescriptionData = await Request.Content.ReadAsStringAsync();
                JObject DescriptionData = JObject.Parse(JSON_DescriptionData);

                if (DescriptionData["newDescription"].ToString().Length > 200)
                {
                    return "Error";
                }

                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                string UpdateDescriptionCmd = "UPDATE UserTexts SET description = @newDescription WHERE title = @title";
                SqlCommand UpdateDescription = new SqlCommand(UpdateDescriptionCmd, con);
                if (DescriptionData["newDescription"].ToString() == "")
                {
                    UpdateDescription.Parameters.AddWithValue("@newDescription", SqlDbType.NVarChar).Value = DBNull.Value;
                }
                else
                {
                    UpdateDescription.Parameters.AddWithValue("@newDescription", SqlDbType.NVarChar).Value =
                        DescriptionData["newDescription"].ToString();
                }
                UpdateDescription.Parameters.AddWithValue("@title", SqlDbType.NVarChar).Value =
                   DescriptionData["currentTitle"].ToString();
                UpdateDescription.ExecuteNonQuery();

                con.Close();
                return "Success";
            }
            catch
            {
                return "Error";
            }
        }

        [HttpPut]
        [Route("api/usertexteditcontroller/updatetext")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> UpdateText()
        {
            try
            {
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                string connectionString = GetUserConnectionString(username);
                string JSON_TextData = await Request.Content.ReadAsStringAsync();
                JObject TextData = JObject.Parse(JSON_TextData);

                if (TextData["newText"].ToString().Length > 300000)
                {
                    return "Error";
                }

                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                string UpdateTextCmd = "UPDATE UserTexts SET text = @newText WHERE title = @title";
                SqlCommand UpdateText = new SqlCommand(UpdateTextCmd, con);
                UpdateText.Parameters.AddWithValue("@newText", SqlDbType.NVarChar).Value =
                    TextData["newText"].ToString();
                UpdateText.Parameters.AddWithValue("@title", SqlDbType.NVarChar).Value =
                   TextData["currentTitle"].ToString();
                UpdateText.ExecuteNonQuery();

                con.Close();
                return "Success";
            }
            catch
            {
                return "Error";
            }
        }
    }
}
