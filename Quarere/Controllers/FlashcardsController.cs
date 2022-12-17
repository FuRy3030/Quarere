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
using Quarere.Models;
using System.Threading;
using Newtonsoft.Json.Linq;
using System.Data.SqlClient;
using System.Data;
using System.Diagnostics;

namespace Quarere.Controllers
{
    public class FlashcardsController : ApiController
    {
        [HttpPost]
        [Route("api/flashcardscontroller/getflashcardsfields")]
        [BasicAuthentication]
        [AllowCrossSite]
        public async Task<Queue<FlashcardsFields>> GetFlashcardsFields()
        {
            try
            {
                string username = Thread.CurrentPrincipal.Identity.Name.ToString();
                var JSON_FieldTypes = await Request.Content.ReadAsStringAsync();
                var FieldTypes = JArray.Parse(JSON_FieldTypes);
                Debug.WriteLine('a');

                string connectionString = GetUserConnectionString(username);
                SqlConnection con = new SqlConnection(connectionString);
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                for (int i = 1; i < 3; i++)
                {
                    switch (FieldTypes[i].ToString())
                    {
                        case "Word / Phrase":
                            FieldTypes[i] = "word";
                            break;
                        case "Meaning":
                            FieldTypes[i] = "meaning";
                            break;
                        case "Translation":
                            FieldTypes[i] = "native_definition";
                            break;
                        case "Synonyms":
                            FieldTypes[i] = "synonyms";
                            break;
                        case "Example":
                            FieldTypes[i] = "example";
                            break;
                        case "Text Example":
                            FieldTypes[i] = "in_context_example";
                            break;
                        default:
                            return new Queue<FlashcardsFields>();
                    }
                }

                Queue<FlashcardsFields> Fields = new Queue<FlashcardsFields>();

                if (CheckIfTableExists(FieldTypes[0].ToString().Replace(' ', '_'), con))
                {
                    string GetFieldsCmd = "SELECT " + FieldTypes[1] + ", " + FieldTypes[2] + " FROM " + 
                        FieldTypes[0].ToString().Replace(' ', '_');
                    SqlCommand GetFields = new SqlCommand(GetFieldsCmd, con);
                    using (SqlDataReader rdr = GetFields.ExecuteReader())
                    {
                        while (rdr.Read())
                        {
                            FlashcardsFields CurrentInstance = new FlashcardsFields();
                            if (!rdr.IsDBNull(0))
                            {
                                CurrentInstance.FrontField = rdr.GetString(0);
                            }
                            if (!rdr.IsDBNull(1))
                            {
                                CurrentInstance.BackField = rdr.GetString(1);
                            }
                            Fields.Enqueue(CurrentInstance);
                        }
                    }
                    con.Close();
                    return Fields;
                }

                con.Close();
                return Fields;
            }
            catch
            {
                return new Queue<FlashcardsFields>();
            }
        }
    }
}
