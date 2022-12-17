using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Quarere
{
    public partial class Formularz_sieci_Web1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void CarouselButton_ServerClick(object sender, EventArgs e)
        {
            Response.Redirect("TextAnalyzer.aspx");
        }

        protected void RedirectToAddingWords(object sender, EventArgs e)
        {
            Response.Redirect("AddingWords.aspx");
        }

        protected void RedirectToErrors(object sender, EventArgs e)
        {
            Response.Redirect("ReportingErrors.aspx");
        }
    }
}