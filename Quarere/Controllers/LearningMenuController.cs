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

namespace Quarere.Controllers
{
    public class LearningMenuController : ApiController
    {
        [HttpGet]
        [Route("api/learningMenucontroller/getcollections")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<Queue<UserCollection>> GetCollections()
        {
            try
            {
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                string connectionString = GetUserConnectionString(username);

                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                string GetAllUserCollectionsCmd = "SELECT title, creation_time FROM UserCollections;";
                SqlCommand GetAllUserCollections = new SqlCommand(GetAllUserCollectionsCmd, con);
                Queue<UserCollection> UserCollections = new Queue<UserCollection>();

                using (SqlDataReader rdr = GetAllUserCollections.ExecuteReader())
                {
                    while (rdr.Read())
                    {
                        UserCollection Collection = new UserCollection(rdr.GetString(0), rdr.GetDateTime(1));
                        UserCollections.Enqueue(Collection);
                    }
                }

                if (UserCollections.Count > 0)
                {
                    List<string> TableNames = new List<string>();
                    DataTable dt = con.GetSchema("Tables");
                    foreach (DataRow row in dt.Rows)
                    {
                        string TableName = (string)row[2];
                        TableNames.Add(TableName);
                    }

                    foreach (var UserCollection in UserCollections)
                    {
                        string ProperTitle = UserCollection.Title.Replace(" ", "_");
                        if (TableNames.Contains(ProperTitle))
                        {
                            string GetRowsNumberCmd = "SELECT COUNT(*) FROM " + ProperTitle;
                            SqlCommand GetRowsNumber = new SqlCommand(GetRowsNumberCmd, con);
                            UserCollection.TermsCount = (int)GetRowsNumber.ExecuteScalar();
                        }
                    }
                }

                con.Close();
                return UserCollections;
            }
            catch
            {
                return new Queue<UserCollection>();
            }
        }
    }
}
