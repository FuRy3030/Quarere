using System;
using System.Collections.Generic;
using System.Data.Entity.Core.EntityClient;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace Quarere.Classes
{
    public class ConnectionStringGenerator
    {
        public static string GetUserConnectionString(string username)
        {
            string providerName = "System.Data.SqlClient";
            string serverName = @"LAPTOP-8N32LMJU\SQLEXPRESS";
            string databaseName = username;

            SqlConnectionStringBuilder sqlBuilder = new SqlConnectionStringBuilder();

            sqlBuilder.DataSource = serverName;
            sqlBuilder.InitialCatalog = databaseName;
            sqlBuilder.IntegratedSecurity = true;

            string providerString = sqlBuilder.ToString();

            return providerString;
        }
    }
}