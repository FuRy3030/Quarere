using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using Tesseract;
using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;
using Page = UglyToad.PdfPig.Content.Page;
using Word = UglyToad.PdfPig.Content.Word;
using PDFiumSharp;
using Pdf2Image;
using System.Text;
using System.Diagnostics;

namespace Quarere.Classes
{
    public class ConvertFileToText
    {
        public static string ConvertPDFToText(string pdfName)
        {
            string pdfPath = $@"C:\Users\adamd\source\repos\Quarere - Sącz\Quarere\App_Data\File_Upload\{pdfName}";
            string text = "";
            Debug.WriteLine(1.1);
            using (var stream = File.OpenRead(pdfPath))
            using (UglyToad.PdfPig.PdfDocument document = UglyToad.PdfPig.PdfDocument.Open(stream))
            {
                Debug.WriteLine(2.1);
                foreach (var page in document.GetPages())
                {
                    //string pageContent = page.Text.Replace("\t", " "); 
                    //PagesText.Add(pageContent);
                    //.Replace("\t", " ");
                    foreach (var word in page.GetWords())
                    {
                        text = text + word.Text + " ";
                    }
                }
            }
            //return PagesText;
            Debug.WriteLine(3.1);
            return text;
        }

        public static List<string> ConvertScanToText(string pdfName)
        {
            int pageCount;
            string pdfPath = $@"C:\Users\adamd\source\repos\Quarere - Sącz\Quarere\App_Data\File_Upload\{pdfName}";
            using (var stream = File.OpenRead(pdfPath))
            using (UglyToad.PdfPig.PdfDocument document = UglyToad.PdfPig.PdfDocument.Open(stream))
            {
                pageCount = document.NumberOfPages;
                if(pageCount > 5) { pageCount = 5; }
            }

            PdfSplitter.WriteImages(pdfPath, @"C:\Users\adamd\source\repos\Quarere - Sącz\Quarere\App_Data\File_Upload", 
                PdfSplitter.Scale.High, PdfSplitter.CompressionLevel.Medium);
            List<string> PagesText = new List<string>();
            for(int i = 0; i < pageCount; i++)
            {
                string pageContent = ConvertImageScanToText(pdfName.Replace(".pdf", "") + $"_{i+1}.jpg");
                PagesText.Add(pageContent);
            }
            return PagesText;
        }

        public static string ConvertImageToText(string imageName)
        {
            string image = $@"C:\Users\adamd\source\repos\Quarere - Sącz\Quarere\App_Data\File_Upload\{imageName}";
            string tesseractData = @"C:\Users\PC\source\repos\Quarere - v2\Quarere\tessdata";
            using (var engine = new TesseractEngine(tesseractData, "eng", EngineMode.TesseractAndLstm))
            {
                using (var img = Pix.LoadFromFile(image))
                {
                    using (var page = engine.Process(img))
                    {
                        string text = page.GetText();
                        string CorrectedText = text.Replace("-\n", "").Replace("\n", " ");                        
                        return CorrectedText;
                    }
                }
            }
        }

        private static string ConvertImageScanToText(string imageName)
        {
            string image = $@"C:\Users\adamd\source\repos\Quarere - Sącz\Quarere\App_Data\File_Upload\{imageName}";
            string tesseractData = @"C:\Users\adamd\source\repos\Quarere - Sącz\Quarere\tessdata";
            using (var engine = new TesseractEngine(tesseractData, "eng", EngineMode.TesseractAndLstm))
            {
                using (var img = Pix.LoadFromFile(image))
                {
                    using (var page = engine.Process(img))
                    {
                        string text = page.GetText();
                        return text.Replace("-\n", "").Replace("\n", " ");
                    }
                }
            }
        }
    }
}