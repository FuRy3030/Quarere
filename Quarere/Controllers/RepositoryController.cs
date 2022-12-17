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
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using static Quarere.Classes.ConnectionStringGenerator;

namespace Quarere.Controllers
{
    public class RepositoryController : ApiController
    {
        [HttpGet]
        [Route("api/repositorycontroller/getalltexts")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<List<UserText>> GetAllUserTexts()
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

                string GetAllUserTextsCmd = "SELECT title, creation_time FROM UserTexts;";
                SqlCommand GetAllUserTexts = new SqlCommand(GetAllUserTextsCmd, con);
                List<UserText> UserTexts = new List<UserText>();

                using (SqlDataReader rdr = GetAllUserTexts.ExecuteReader())
                {
                    while (rdr.Read())
                    {
                        UserText Text = new UserText(rdr.GetString(0), rdr.GetDateTime(1));
                        UserTexts.Add(Text);
                    }
                }

                con.Close();
                return UserTexts;
            }
            catch
            {
                return new List<UserText>();
            }
        }

        [HttpGet]
        [Route("api/repositorycontroller/getallcollections")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<List<UserCollection>> GetAllUserCollections()
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
                List<UserCollection> UserCollections = new List<UserCollection>();

                using (SqlDataReader rdr = GetAllUserCollections.ExecuteReader())
                {
                    while (rdr.Read())
                    {
                        UserCollection Collection = new UserCollection(rdr.GetString(0), rdr.GetDateTime(1));
                        UserCollections.Add(Collection);
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
                return new List<UserCollection>();
            }
        }

        [HttpGet]
        [Route("api/repositorycontroller/getallfavourites")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<Queue<UserFavourite>> GetAllFavourites()
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

                string GetAllUserFavouritesCmd = "SELECT title, terms_count, creation_time FROM UserFavorites;";
                SqlCommand GetAllUserFavourites = new SqlCommand(GetAllUserFavouritesCmd, con);
                Queue<UserFavourite> UserFavourites = new Queue<UserFavourite>();

                using (SqlDataReader rdr = GetAllUserFavourites.ExecuteReader())
                {
                    while (rdr.Read())
                    {
                        if (rdr.IsDBNull(1))
                        {
                            UserFavourite FavouriteElement = new UserFavourite
                                (rdr.GetString(0), 0, rdr.GetDateTime(2));
                            UserFavourites.Enqueue(FavouriteElement);
                        }
                        else
                        {
                            UserFavourite FavouriteElement = new UserFavourite
                                (rdr.GetString(0), rdr.GetInt16(1), rdr.GetDateTime(2));
                            UserFavourites.Enqueue(FavouriteElement);
                        }
                    }
                }

                con.Close();
                return UserFavourites;
            }
            catch
            {
                return new Queue<UserFavourite>();
            }
        }

        [HttpPost]
        [Route("api/repositorycontroller/addfavouritetext")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> AddFavouriteText()
        {
            try
            {
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                var JSON_FavouriteText = await Request.Content.ReadAsStringAsync();
                var FavouriteTextData = JObject.Parse(JSON_FavouriteText);

                string connectionString = GetUserConnectionString(username);
                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }
                string AddTextToFavoritesCmd = "INSERT INTO UserFavorites " +
                "(title, terms_count, creation_time) values (@title, @terms_count, @creationTime);";
                SqlCommand AddTextToFavorites = new SqlCommand(AddTextToFavoritesCmd, con);
                AddTextToFavorites.Parameters.AddWithValue("@title", SqlDbType.NVarChar)
                    .Value = FavouriteTextData["title"].ToString();
                AddTextToFavorites.Parameters.AddWithValue("@terms_count", SqlDbType.SmallInt)
                    .Value = DBNull.Value;
                AddTextToFavorites.Parameters.AddWithValue("@creationTime", SqlDbType.SmallDateTime)
                    .Value = DateTime.Parse(FavouriteTextData["creationTime"].ToString());
                AddTextToFavorites.ExecuteNonQuery();

                con.Close();
                return "Success";
            }
            catch
            {
                return "Something went wrong";
            }
        }

        [HttpPost]
        [Route("api/repositorycontroller/addfavouritecollection")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> AddFavouriteCollection()
        {
            try
            {
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                var JSON_FavouriteText = await Request.Content.ReadAsStringAsync();
                var FavouriteTextData = JObject.Parse(JSON_FavouriteText);

                string connectionString = GetUserConnectionString(username);
                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }
                string AddTextToFavoritesCmd = "INSERT INTO UserFavorites " +
                "(title, terms_count, creation_time) values (@title, @terms_count, @creationTime);";
                SqlCommand AddTextToFavorites = new SqlCommand(AddTextToFavoritesCmd, con);
                AddTextToFavorites.Parameters.AddWithValue("@title", SqlDbType.NVarChar)
                    .Value = FavouriteTextData["title"].ToString();
                AddTextToFavorites.Parameters.AddWithValue("@terms_count", SqlDbType.SmallInt)
                    .Value = Int32.Parse(FavouriteTextData["termsCount"].ToString());
                AddTextToFavorites.Parameters.AddWithValue("@creationTime", SqlDbType.SmallDateTime)
                    .Value = DateTime.Parse(FavouriteTextData["creationTime"].ToString());
                AddTextToFavorites.ExecuteNonQuery();

                con.Close();
                return "Success";
            }
            catch
            {
                return "Something went wrong";
            }
        }

        [HttpDelete]
        [Route("api/repositorycontroller/deletefavouriteitem")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> DeleteFavouriteItem()
        {
            try
            {
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                var JSON_FavouriteDeleteData = await Request.Content.ReadAsStringAsync();
                var FavouriteDeleteData = JObject.Parse(JSON_FavouriteDeleteData);

                string connectionString = GetUserConnectionString(username);
                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                if (FavouriteDeleteData["elementType"].ToString() == "text")
                {
                    string DeleteItemFromFavoritesCmd = "DELETE FROM UserFavorites WHERE title = @title AND " +
                        "terms_count IS NULL;";
                    SqlCommand DeleteItemFromFavorites = new SqlCommand(DeleteItemFromFavoritesCmd, con);
                    DeleteItemFromFavorites.Parameters.AddWithValue("@title", SqlDbType.NVarChar)
                        .Value = FavouriteDeleteData["title"].ToString();
                    DeleteItemFromFavorites.ExecuteNonQuery();
                }
                else
                {
                    string DeleteItemFromFavoritesCmd = "DELETE FROM UserFavorites WHERE title = @title AND " +
                        "terms_count IS NOT NULL;";
                    SqlCommand DeleteItemFromFavorites = new SqlCommand(DeleteItemFromFavoritesCmd, con);
                    DeleteItemFromFavorites.Parameters.AddWithValue("@title", SqlDbType.NVarChar)
                        .Value = FavouriteDeleteData["title"].ToString();
                    DeleteItemFromFavorites.ExecuteNonQuery();
                }

                con.Close();
                return "Success";
            }
            catch
            {
                return "Something went wrong";
            }
        }

        [HttpDelete]
        [Route("api/repositorycontroller/deleteitem")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<string> DeleteItem()
        {
            try
            {
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                var JSON_FavouriteDeleteData = await Request.Content.ReadAsStringAsync();
                var FavouriteDeleteData = JObject.Parse(JSON_FavouriteDeleteData);

                string connectionString = GetUserConnectionString(username);
                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                if (FavouriteDeleteData["elementType"].ToString() == "text")
                {
                    string DeleteItemFromFavoritesCmd = "DELETE FROM UserFavorites WHERE title = @title AND " +
                        "terms_count IS NULL;";
                    SqlCommand DeleteItemFromFavorites = new SqlCommand(DeleteItemFromFavoritesCmd, con);
                    DeleteItemFromFavorites.Parameters.AddWithValue("@title", SqlDbType.NVarChar)
                        .Value = FavouriteDeleteData["title"].ToString();
                    DeleteItemFromFavorites.ExecuteNonQuery();

                    string DeleteItemFromTextsCmd = "DELETE FROM UserTexts WHERE title = @title;";
                    SqlCommand DeleteItemFromTexts = new SqlCommand(DeleteItemFromTextsCmd, con);
                    DeleteItemFromTexts.Parameters.AddWithValue("@title", SqlDbType.NVarChar)
                        .Value = FavouriteDeleteData["title"].ToString();
                    DeleteItemFromTexts.ExecuteNonQuery();
                }
                else
                {
                    string DeleteItemFromFavoritesCmd = "DELETE FROM UserFavorites WHERE title = @title AND " +
                        "terms_count IS NOT NULL;";
                    SqlCommand DeleteItemFromFavorites = new SqlCommand(DeleteItemFromFavoritesCmd, con);
                    DeleteItemFromFavorites.Parameters.AddWithValue("@title", SqlDbType.NVarChar)
                        .Value = FavouriteDeleteData["title"].ToString();
                    DeleteItemFromFavorites.ExecuteNonQuery();

                    string DeleteItemFromCollectionsCmd = "DELETE FROM UserCollections WHERE title = @title;";
                    SqlCommand DeleteItemFromCollections = new SqlCommand(DeleteItemFromCollectionsCmd, con);
                    DeleteItemFromCollections.Parameters.AddWithValue("@title", SqlDbType.NVarChar)
                        .Value = FavouriteDeleteData["title"].ToString();
                    DeleteItemFromCollections.ExecuteNonQuery();

                    List<string> TableNames = new List<string>();
                    DataTable dt = con.GetSchema("Tables");
                    foreach (DataRow row in dt.Rows)
                    {
                        string TableName = (string)row[2];
                        TableNames.Add(TableName);
                    }
                    string ProperTitle = FavouriteDeleteData["title"].ToString().Replace(" ", "_");
                    if (TableNames.Contains(ProperTitle))
                    {
                        string DropTableCmd = "DROP TABLE " + ProperTitle;
                        SqlCommand DropTable = new SqlCommand(DropTableCmd, con);
                        DropTable.ExecuteNonQuery();
                    }
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
