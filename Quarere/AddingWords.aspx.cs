using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Quarere
{
    public partial class Formularz_sieci_Web12 : System.Web.UI.Page
    {
        string connection = ConfigurationManager.ConnectionStrings["con"].ConnectionString;

        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void AddingButton_Click(object sender, EventArgs e)
        {
            try
            {
                if(Word.Text.Trim() == "")
                {
                    ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "alertMessage", 
                        "alert('Please Type Word'); window.location = 'AddingWords.aspx';", true);
                }
                else
                {
                    AddWord();
                }
            }

            catch(Exception ex)
            {
                ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "alertMessage", 
                    "alert('" + ex.Message + "'); window.location = 'AddingWords.aspx';", true);
            }
        }
        protected void AddWord()
        {
            SqlConnection con = new SqlConnection(connection);
            if (con.State == System.Data.ConnectionState.Closed)
            {
                con.Open();
            }

            SqlCommand cmd = new SqlCommand("INSERT INTO AddingWords " +
                "(word, partofspeech, word_level, additional_desc) values " +
                "(@wordsuggestion, @partofspeech, @wordlevel, @description)", con);

            cmd.Parameters.AddWithValue("@wordsuggestion", Word.Text.Trim());
            cmd.Parameters.AddWithValue("@partofspeech", PartOfSpeech.SelectedItem.Value);
            cmd.Parameters.AddWithValue("@wordlevel", WordLevel.SelectedItem.Value);
            cmd.Parameters.AddWithValue("@description", Additional_Info.Text.Trim());

            cmd.ExecuteNonQuery();
            con.Close();

            ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "alertMessage", 
                "alert('Word Idea Successfully Submitted'); window.location = 'AddingWords.aspx';", true);
        }
    }
}