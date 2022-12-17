using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Linq;
using System.Web;

namespace Quarere.Classes
{
    public class LoginAuthentication
    {   
        public static bool Authenticate(string username, string SessionID)
        {
            string connection = ConfigurationManager.ConnectionStrings["users"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connection))
            {
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }
                UserData CurrentUser = new UserData();
                string SqlQuery = "SELECT current_session_id, is_authenticated FROM Users " +
                    "WHERE username = '"+ username + "';";

                using (SqlCommand findUser = new SqlCommand(SqlQuery, con))
                {
                    using (SqlDataReader reader = findUser.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            CurrentUser.dbSession = reader.GetString(0);
                            CurrentUser.dbIsAuthenticated = reader.GetSqlBoolean(1);
                        }

                        reader.Close();
                    }
                }
                con.Close();

                if (CurrentUser.dbSession == SessionID && CurrentUser.dbIsAuthenticated == true)
                {
                    return true;
                }
                else 
                {
                    return false;
                }
            }
        }
    }

    public class UserData
    {
        public string dbSession {get; set;}
        public SqlBoolean dbIsAuthenticated { get; set; }
    }
}