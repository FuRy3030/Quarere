<%@ Page Title="Quarere | Reporting Errors" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="ReportingErrors.aspx.cs" Inherits="Quarere.Formularz_sieci_Web13" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Quarere | Reporting Errors</title>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <section id="ReportingErrors">
        <div class="container">
            <div class="row">
                <div class="col-xs-12 d-flex justify-content-center">
                    <div class="card mb-3 mt-3">
                      <img src="images/Errors2.jpg" class="card-img-top img-fluid error_img" alt="...">
                      <div class="card-body">
                        <h5 class="card-title">Report Issue</h5>
                        <hr class="hrAdding"/>
                        <div class="row">
                            <div class="col-sm-8 error_col">
                                <label class="form-label">On what page/URL did you notice the problem?</label><br />
                                <asp:TextBox ID="ErrorPage" runat="server" CssClass="WordTextBox"
                                 ToolTip="Type page Adress/URL" placeholder="Page Adress">
                                </asp:TextBox>
                            </div>
                            <div class="col-sm-4 error_col">
                                <label class="form-label">What browser are you using?</label><br />
                                <asp:DropDownList ID="Browser" runat="server" CssClass="DropdownWord">
                                    <asp:ListItem Value="">Please Select</asp:ListItem>  
                                    <asp:ListItem>Chrome</asp:ListItem>
                                    <asp:ListItem>Internet Explorer</asp:ListItem>
                                    <asp:ListItem>Mozilla Firefox</asp:ListItem>
                                    <asp:ListItem>Microsoft Edge</asp:ListItem>
                                    <asp:ListItem>Safari</asp:ListItem>
                                    <asp:ListItem>Opera</asp:ListItem>
                                 </asp:DropDownList>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-8 error_col">
                                <label class="form-label">Please describe the problem</label><br />
                                <asp:TextBox ID="ErrorDescription" runat="server" CssClass="WordTextBox" Rows="4"
                                 ToolTip="Describle problem in detail" placeholder="Describle Problem in Detail" TextMode="MultiLine">
                                </asp:TextBox>
                            </div>
                            <div class="col-sm-4 error_col">
                                <label class="form-label">What type of device are you using? </label><br />
                                <asp:RadioButtonList ID="Device" runat="server">
                                    <asp:ListItem Value="Apple (Mac)">&nbsp Apple (Mac)</asp:ListItem>
                                    <asp:ListItem Value="Windows PC">&nbsp Windows PC</asp:ListItem>
                                    <asp:ListItem Value="Smartphone">&nbsp Smartphone</asp:ListItem>
                                    <asp:ListItem Value="Tablet">&nbsp Tablet</asp:ListItem>
                                </asp:RadioButtonList>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6" id="BottomTextBox-Errors">
                                <label class="form-label">What is the version of the browser?</label><br />
                                <asp:TextBox ID="BrowserVersion" runat="server" CssClass="WordTextBox"
                                 ToolTip="You can usually find this by clicking Help or About" placeholder="Find this by clicking Help or About">
                                </asp:TextBox>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Email:</label><br />
                                <asp:TextBox ID="EmailError" runat="server" CssClass="WordTextBox"
                                 ToolTip="Type your email" placeholder="Your Email">
                                </asp:TextBox>
                            </div>
                        </div>
                        <div class="row buttonrow">
                            <div class="col-12 mx-auto">
                                <center>
                                    <asp:LinkButton ID="ReportingButton" runat="server" Cssclass="ErrorsButton" OnClick="ReportingButton_Click">
                                        Submit <i class="fas fa-paper-plane button_icon"></i>
                                    </asp:LinkButton> 
                                </center>
                            </div>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</asp:Content>
