using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.SessionState;
using System.Diagnostics;

namespace Quarere
{
    public class Word
    {
        public string word;
        public string level;
        public int position_in_text;
        public Word(int _position, string _word, string _level)
        {
            position_in_text = _position;
            word = _word;
            level = _level; 
        }
    }
    public partial class Formularz_sieci_Web11 : System.Web.UI.Page
    {
        string connection = ConfigurationManager.ConnectionStrings["wordsCon"].ConnectionString;
        protected void Page_Load(object sender, EventArgs e)
        {
            HttpCookie ShouldGuideBeClosed = Request.Cookies["ShouldGuideBeClosed"];
            if (ShouldGuideBeClosed == null)
            {
                return;
            }
            if (!string.IsNullOrEmpty(ShouldGuideBeClosed.Values[(string)Session["username"]]))
            {
                if (ShouldGuideBeClosed.Values[(string)Session["username"]].ToString() == "Closed")
                {
                    TextAnalyzerGuide.Style["display"] = "none";
                    TextAnalyzerGuideClose.Style["display"] = "none";
                }
            }
        }
        protected void refresh_button_Click(object sender, EventArgs e)
        {
            Analyzer.ReadOnly = false;
            Analyzer.Text = "";
            Analyzer.BackColor = Color.White;
        }
        protected void Close_Guide_Click(object sender, EventArgs e)
        {
            TextAnalyzerGuide.Style["display"] = "none";
            TextAnalyzerGuideClose.Style["display"] = "none";
            HttpCookie ShouldGuideBeClosed = new HttpCookie("ShouldGuideBeClosed");
            ShouldGuideBeClosed.Values.Add((string)Session["username"], "Closed");
            ShouldGuideBeClosed.Expires = DateTime.Now.AddMonths(3);
            Response.Cookies.Add(ShouldGuideBeClosed);
        }
        protected void button_analyzer_Click(object sender, EventArgs e)
        {
            int A1 = 0, A2 = 0, B1 = 0, B2 = 0, C1 = 0, C2 = 0, NoNClassified = 0;
            string text = Analyzer.Text.ToLower().Trim().Replace("'ll", " will").Replace("'re", " are").Replace("'ve", " have").Replace(".", "").Replace(",", "").Replace(";", "").Replace(":", "").Replace("-", "").Replace("?", "").Replace("!", "").Replace("...", "").Replace("(", "").Replace(")", "").Replace("[", "").Replace("]", "").Replace("\"", "").Replace("—", "");
            List<string> TextWords = new List<string>();
            TextWords = text.Split(' ').ToList();
            List<string> UniqueTextWords = TextWords.Distinct().ToList();
            SqlConnection con = new SqlConnection(connection);
            if(con.State == ConnectionState.Closed)
            {
                con.Open();
            }
            string query;
            List<Word> TableWords = new List<Word>();
            for(int i = 0; i < UniqueTextWords.Count(); i++)
            {
                if(UniqueTextWords[i].Contains("n't"))
                {
                    UniqueTextWords[i] = UniqueTextWords[i].Replace("'", "’");
                }
                else { UniqueTextWords[i] = UniqueTextWords[i].Replace("'", ""); }
                query = "SELECT level FROM shortWords WHERE word = '" + UniqueTextWords[i] + "'";
                using (SqlCommand command = new SqlCommand(query, con))
                {
                    TableWords.Add(new Word(i+1, UniqueTextWords[i], (string)command.ExecuteScalar()));
                }
                switch(TableWords[i].level)
                {
                    case "A1":
                        A1++; break;
                    case "A2":
                        A2++; break;
                    case "B1":
                        B1++; break;
                    case "B2":
                        B2++; break;
                    case "C1":
                        C1++; break;
                    case "C2":
                        C2++; break;
                    case null:
                        NoNClassified++; break;
                }
            }
            con.Close();
            string word_json = JsonConvert.SerializeObject(TableWords);
            // HiddenField jsonField = new HiddenField
            // {
            // ID = "WordData"
            // };
            // jsonField.Value = word_json;
            // HiddenData.Controls.Add(jsonField);
            // HiddenField1.Value = word_json;
            int all_words = UniqueTextWords.Count();
            string RenderTable = $"RenderTable({word_json});";
            string RenderBars = $"RenderDifficultyBars({all_words},{A1},{A2},{B1},{B2},{C1},{C2},{NoNClassified});";
            string RenderCountTable = $"RenderCountTable({all_words},{A1},{A2},{B1},{B2},{C1},{C2},{NoNClassified});";
            ClientScript.RegisterStartupScript
                (this.GetType(), "RenderFunctionBars", RenderBars, true);
            ClientScript.RegisterStartupScript
                (this.GetType(), "RenderFunctionCountTable", RenderCountTable, true);
            ClientScript.RegisterStartupScript
                (this.GetType(), "RenderFunctionTable", RenderTable, true);
            Analyzer.ReadOnly = true;
            Color Temp = Color.FromArgb(0xf1f2f6);
            Analyzer.BackColor = Temp;
        }
    }
}