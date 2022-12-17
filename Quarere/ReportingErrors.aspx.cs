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
    public partial class Formularz_sieci_Web13 : System.Web.UI.Page
    {
        string connection = ConfigurationManager.ConnectionStrings["con"].ConnectionString;
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void ReportingButton_Click(object sender, EventArgs e)
        {
            try
            {
                if (ErrorPage.Text.Trim() == "" || ErrorDescription.Text.Trim() == "")
                {
                    ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "alertMessage",
                        "alert('Please Type URL and Describe the Problem'); window.location = 'ReportingErrors.aspx';", true);
                }
                else
                {
                    AddReport();
                }
            }

            catch (System.NullReferenceException exception)
            {
                ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "alertMessage",
                    "alert('Please Select Device Type'); window.location = 'ReportingErrors.aspx';", true);
            }

            catch (Exception ex)
            {
                ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "alertMessage",
                    "alert('" + ex.Message + "'); window.location = 'ReportingErrors.aspx';", true);
            }
        }
        protected void AddReport()
        {
            SqlConnection con = new SqlConnection(connection);
            if (con.State == System.Data.ConnectionState.Closed)
            {
                con.Open();
            }

            SqlCommand cmd = new SqlCommand("INSERT INTO ErrorReports " +
                "(url, problem_desc, device, browser, browser_version, email) values " +
                "(@page, @problem, @devicetype, @browsertype, @version, @mail)", con);

            cmd.Parameters.AddWithValue("@page", ErrorPage.Text.Trim());
            cmd.Parameters.AddWithValue("@problem", ErrorDescription.Text.Trim());
            cmd.Parameters.AddWithValue("@devicetype", Device.SelectedItem.Value);
            cmd.Parameters.AddWithValue("@browsertype", Browser.SelectedItem.Value);
            cmd.Parameters.AddWithValue("@version", BrowserVersion.Text.Trim());
            cmd.Parameters.AddWithValue("@mail", EmailError.Text.Trim());

            cmd.ExecuteNonQuery();
            con.Close();

            ScriptManager.RegisterClientScriptBlock(this, this.GetType(), "alertMessage",
                "alert('Report Successfully Submitted'); window.location = 'ReportingErrors.aspx';", true);
        }
    }
}