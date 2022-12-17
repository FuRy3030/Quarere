<%@ Page Title="Quarere | Adding Word Suggestions" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="AddingWords.aspx.cs" Inherits="Quarere.Formularz_sieci_Web12" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>Quarere | Adding Word Suggestions</title>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <section id="AddingWords">
        <div class="container">
            <div class="row">
                <div class="col-xs-12 d-flex justify-content-center">
                    <div class="card mb-3 mt-3">
                        <img src="images/wordgroup2.jpg" class="card-img-top img-fluid wordgroup mx-auto" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">Add Word Ideas</h5>
                            <hr class="hrAdding"/>
                            <div class="row addingrow gy-2">
                                <div class="col-sm-8">
                                    <label class="form-label">Word Suggestion</label><br />
                                    <asp:TextBox ID="Word" runat="server" CssClass="WordTextBox"
                                     ToolTip="Type your word idea" placeholder="Word Idea">
                                    </asp:TextBox>
                                </div>
                                <div class="col-sm-4">
                                    <label class="form-label">Part of Speech</label><br />
                                    <asp:DropDownList ID="PartOfSpeech" runat="server" CssClass="DropdownWord">
                                        <asp:ListItem Value="">Please Select</asp:ListItem>  
                                        <asp:ListItem>Noun</asp:ListItem>
                                        <asp:ListItem>Pronoun</asp:ListItem>
                                        <asp:ListItem>Verb</asp:ListItem>
                                        <asp:ListItem>Adjective</asp:ListItem>
                                        <asp:ListItem>Adverb</asp:ListItem>
                                        <asp:ListItem>Preposition</asp:ListItem>
                                        <asp:ListItem>Conjunction</asp:ListItem>
                                        <asp:ListItem>Interjection</asp:ListItem>
                                        <asp:ListItem>Determiner</asp:ListItem>
                                    </asp:DropDownList>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-8">
                                    <label class="form-label">Additional Description</label><br />
                                    <asp:TextBox ID="Additional_Info" runat="server" CssClass="WordTextBox" TextMode="MultiLine"
                                     ToolTip="Something in mind? Type it!" placeholder="Any Additional Content" Rows="3">
                                    </asp:TextBox>
                                </div>
                                <div class="col-sm-4">
                                    <label class="form-label">Word Level</label><br />
                                    <asp:DropDownList ID="WordLevel" runat="server" CssClass="DropdownWord">
                                        <asp:ListItem Value="">Please Select</asp:ListItem>  
                                        <asp:ListItem>A1</asp:ListItem>
                                        <asp:ListItem>A2</asp:ListItem>
                                        <asp:ListItem>B1</asp:ListItem>
                                        <asp:ListItem>B2</asp:ListItem>
                                        <asp:ListItem>C1</asp:ListItem>
                                        <asp:ListItem>C2</asp:ListItem>
                                    </asp:DropDownList>
                                </div>
                            </div>
                            <div class="row buttonrow">
                                <div class="col-12 mx-auto">
                                    <center>
                                    <asp:LinkButton ID="AddingButton" runat="server" Cssclass="AddingButton" OnClick="AddingButton_Click">
                                        Add Word <i class="fas fa-paper-plane"></i>
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
