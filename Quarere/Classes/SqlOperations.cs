using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace Quarere.Classes
{
    public class SqlOperations
    {
        public static bool CheckIfTableExists(string title, SqlConnection con)
        {
            List<string> TableNames = new List<string>();
            DataTable dt = con.GetSchema("Tables");
            foreach (DataRow row in dt.Rows)
            {
                string TableName = (string)row[2];
                TableNames.Add(TableName);
            }
            if (TableNames.Contains(title))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public static bool CheckIfTextTitleExists(string title, SqlConnection con)
        {
            Debug.WriteLine(1.2);
            Debug.WriteLine(title);
            string CommandString = "SELECT COUNT(*) FROM UserTexts WHERE title = @title";
            SqlCommand Command = new SqlCommand(CommandString, con);
            Command.Parameters.AddWithValue("@title", SqlDbType.NVarChar).Value = title;
            Debug.WriteLine(2.15);
            var NumberOfTexts = Command.ExecuteScalar().ToString();
            Debug.WriteLine(2.2);
            if (NumberOfTexts == "0")
            {
                return false;
            }
            else
            {
                return true;
            }
        }
    }
}