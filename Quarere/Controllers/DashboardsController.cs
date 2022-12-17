using Newtonsoft.Json;
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
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using static Quarere.Classes.ConnectionStringGenerator;

namespace Quarere.Controllers
{
    public class ResponseObjectCollections
    {
        public string DataType { get; set; }
        public List<RecentlyUsedCollection> Items { get; set; }
        public ResponseObjectCollections(string _data, List<RecentlyUsedCollection> _items)
        {
            DataType = _data;
            Items = _items;
        }
    }

    public class ResponseObjectTexts
    {
        public string DataType { get; set; }
        public List<RecentlyUsedText> Items { get; set; }
        public ResponseObjectTexts(string _data, List<RecentlyUsedText> _items)
        {
            DataType = _data;
            Items = _items;
        }
    }

    public class DashboardsController : ApiController
    {
        [HttpPost]
        [Route("api/dashboardcontroller/recentlyuseditems")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> GetRecentlyUsedComponents()
        {
            var provider = new MultipartFormDataStreamProvider("~/App_Data/File_Upload");
            string username = Thread.CurrentPrincipal.Identity.Name.ToString();

            try
            {
                await Request.Content.ReadAsMultipartAsync(provider);
                string dataType = provider.FormData["dataType"];
                int amount = Int32.Parse(provider.FormData["elementsCount"]);
                string ArrayTitles = provider.FormData["titles"];
                List<string> UniqueTitles = JsonConvert.DeserializeObject<List<string>>(ArrayTitles);
                string connectionString = GetUserConnectionString(username);
                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                if (dataType == "RecentTexts")
                {
                    Debug.WriteLine('a');
                    List<RecentlyUsedText> Texts = new List<RecentlyUsedText>();
                    SqlCommand GetRecentTexts = new SqlCommand("", con);
                    if (UniqueTitles == null || UniqueTitles.Count == 0)
                    {
                        GetRecentTexts.CommandText = "SELECT TOP(@number) * FROM UserTexts ORDER BY creation_time;";
                        GetRecentTexts.Parameters.AddWithValue("@number", SqlDbType.Int).Value = amount;
                    }
                    else
                    {
                        var GetRecentTextsCmd = new System.Text.StringBuilder();
                        GetRecentTextsCmd.Append("SELECT TOP (@number) * FROM UserTexts WHERE title NOT IN (");
                        GetRecentTexts.Parameters.AddWithValue("@number", SqlDbType.Int).Value = amount;
                        for (var i = 0; i < UniqueTitles.Count; i++)
                        {
                            GetRecentTexts.Parameters.AddWithValue("@" + i, UniqueTitles[i]);
                            if (i > 0) { GetRecentTextsCmd.Append(", "); }
                            GetRecentTextsCmd.Append("@" + i);
                        }
                        GetRecentTextsCmd.Append(") ORDER BY creation_time;");
                        GetRecentTexts.CommandText = GetRecentTextsCmd.ToString();
                    }
                    Debug.WriteLine('a');
                    using (SqlDataReader rdr = GetRecentTexts.ExecuteReader())
                    {
                        while(rdr.Read())
                        {
                            if(rdr.IsDBNull(2))
                            {
                                RecentlyUsedText CurrentText = new RecentlyUsedText(rdr.GetString(1),
                                    "", rdr.GetDateTime(4));
                                Texts.Add(CurrentText);
                            }
                            else
                            {
                                RecentlyUsedText CurrentText = new RecentlyUsedText(rdr.GetString(1),
                                    rdr.GetString(2), rdr.GetDateTime(4));
                                Texts.Add(CurrentText);
                            }
                        }
                    }
                    con.Close();
                    ResponseObjectTexts ReturnValue = new ResponseObjectTexts(dataType, Texts);
                    string JSONResult = JsonConvert.SerializeObject(ReturnValue, Formatting.Indented);
                    return JSONResult;
                }
                else
                {
                    List<RecentlyUsedCollection> Collections = new List<RecentlyUsedCollection>();
                    SqlCommand GetRecentCollections = new SqlCommand("", con);
                    if (UniqueTitles == null || UniqueTitles.Count == 0)
                    {
                        GetRecentCollections.CommandText = "SELECT TOP(@number) * FROM UserCollections ORDER BY creation_time;";
                        GetRecentCollections.Parameters.AddWithValue("@number", SqlDbType.Int).Value = amount;
                    }
                    else
                    {
                        var GetRecentCollectionsCmd = new System.Text.StringBuilder();
                        GetRecentCollectionsCmd.Append("SELECT TOP (@number) * FROM UserCollections WHERE title NOT IN (");
                        GetRecentCollections.Parameters.AddWithValue("@number", SqlDbType.Int).Value = amount;
                        for (var i = 0; i < UniqueTitles.Count; i++)
                        {
                            GetRecentCollections.Parameters.AddWithValue("@" + i, UniqueTitles[i]);
                            if (i > 0) { GetRecentCollectionsCmd.Append(", "); }
                            GetRecentCollectionsCmd.Append("@" + i);
                        }
                        GetRecentCollectionsCmd.Append(") ORDER BY creation_time;");
                        GetRecentCollections.CommandText = GetRecentCollectionsCmd.ToString();
                    }
                    using (SqlDataReader rdr = GetRecentCollections.ExecuteReader())
                    {
                        while (rdr.Read())
                        {
                            if (rdr.IsDBNull(2))
                            {
                                RecentlyUsedCollection CurrentCollection = new RecentlyUsedCollection(rdr.GetString(1),
                                    "", rdr.GetDateTime(3));
                                Collections.Add(CurrentCollection);
                            }
                            else
                            {
                                RecentlyUsedCollection CurrentCollection = new RecentlyUsedCollection(rdr.GetString(1),
                                    rdr.GetString(2), rdr.GetDateTime(3));
                                Collections.Add(CurrentCollection);
                            }
                        }
                    }
                    
                    if (Collections.Count > 0)
                    {
                        List<string> TableNames = new List<string>();
                        DataTable dt = con.GetSchema("Tables");
                        foreach (DataRow row in dt.Rows)
                        {
                            string TableName = (string)row[2];
                            TableNames.Add(TableName);
                        }

                        foreach (var Collection in Collections)
                        {
                            if (TableNames.Contains(Collection.Title.Replace(" ", "_")))
                            {
                                string GetRowsNumberCmd = "SELECT COUNT(*) FROM " + Collection.Title.Replace(" ", "_");
                                SqlCommand GetRowsNumber = new SqlCommand(GetRowsNumberCmd, con);
                                Collection.TermsCount = (int)GetRowsNumber.ExecuteScalar();
                            }
                        }
                    }

                    con.Close();
                    ResponseObjectCollections ReturnValue = new ResponseObjectCollections(dataType, Collections);
                    string JSONResult = JsonConvert.SerializeObject(ReturnValue, Formatting.Indented);
                    return JSONResult;
                }
            }
            catch
            {
                return "[]";
            }
        }
    }
}