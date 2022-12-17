//Navabar Pure JS
window.addEventListener('scroll', function() {
    let scrolledPx = window.pageYOffset;
    if (scrolledPx < document.getElementsByClassName('navbar')[0].offsetHeight) {
        const result = document.getElementsByClassName('navbar')[0].offsetHeight - scrolledPx;
        document.getElementById('DashboardContainerHeader').style.top = (result).toString() + 'px';
    }
    else {
        document.getElementById('DashboardContainerHeader').style.top = '0px';
    }
});

document.getElementsByClassName('dashboard-navbar-element')[0].addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = "https://localhost:44369/AddText.aspx";
});

document.getElementsByClassName('dashboard-navbar-element')[1].addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = "https://localhost:44369/TextAnalyzer.aspx";
});

document.getElementsByClassName('dashboard-navbar-element')[4].addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = "https://localhost:44369/Repository.aspx";
});

const navBarHeight = document.getElementById('DashboardContainerHeader').offsetHeight;
document.getElementById('DashboardContainerHeader').style.top = document.getElementsByClassName('navbar')[0].offsetHeight.toString() + 'px';
document.getElementsByClassName('EmptyDiv')[0].style.height = navBarHeight.toString() + 'px';

// const hidden_field = document.getElementById('HiddenField1');
// const table_words = JSON.parse(hidden_field.value);
const tableWords = document.getElementById('AnalyzerTable');
const difficultyBars = document.getElementById('Difficulty');
const tableCount = document.getElementById('CountTable');
const accorditionButton = document.querySelector('.accordion-button');
const accorditionCount = document.getElementById('AccorditionAnalyzer');

function RenderDifficultyBars(wordCount, A1, A2, B1, B2, C1, C2, NoNClassified) {
    const allBarsArray = document.getElementsByClassName('progress-bar');
    difficultyBars.style.display = 'block';
    const allLevelArray = new Array(A1, A2, B1, B2, C1, C2, NoNClassified);
    let barValue = 0;
    for (i = 0; i < 7; i++)
    {
        barValue = (allLevelArray[i] / wordCount) * 100;
        allBarsArray[i].setAttribute('aria-valuenow', `${barValue}`);
        if (i === 2)
        {
            allBarsArray[i].setAttribute('style',
                `width: ${barValue}%; background-color: seagreen !important;
                 background-image: linear-gradient(
                 45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,
                 rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,
                 transparent 75%,transparent); background-size: 1rem 1 rem;`);
        }
        else if (i === 5)
        {
            allBarsArray[i].setAttribute('style',
                `width: ${barValue}%; background-color: purple !important;
                 background-image: linear-gradient(
                 45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,
                 rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,
                 transparent 75%,transparent); background-size: 1rem 1 rem;`);
        }
        else
        {
            allBarsArray[i].setAttribute('style', `width: ${barValue}%`);
        }
    }
}

function RenderCountTable(wordCount, A1, A2, B1, B2, C1, C2, NoNClassified) {
    accorditionCount.style.display = 'block';
    const allLevelArray = new Array(A1, A2, B1, B2, C1, C2, NoNClassified);
    const arrayOfStrings = new Array('A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Unclassified');
    let tableData = [];
    for (i = 0; i < 7; i++)
    {
        const levelData = {
            level: arrayOfStrings[i],
            amount: allLevelArray[i],
            percent: ((allLevelArray[i] / wordCount) * 100).toFixed(2).toString() + '%'
        };
        tableData.push(levelData);
    }
    console.log(tableData);
    $(document).ready(function () {
        $('#CountTable').DataTable({
            dom: 'rt',
            responsive: true,
            data: tableData,
            columns: [
                { data: 'level' },
                { data: 'amount' },
                { data: 'percent' }
            ]
        });
    });
    document.getElementById('CollapseButtonAnalyzer').classList.add('collapsed');
}

function RenderTable(word_json) {
    const table_words = word_json;
    tableWords.style.display = 'table';
    $(document).ready(function () {
        $('#AnalyzerTable').DataTable({
           // dom: 'lBfrtip',
            dom: "<'row gy-2'<'col-lg-6 col-xl-7 col-xxl-8'B><'col-sm-6 float-right col-lg-2 col-xxl-1'l><'col-sm-6 float-right col-lg-4 col-xl-3 col-xxl-3'f>>" +
                 "<'row'<'col-sm-12'tr>>" +
                 "<'row gy-2'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>",
            responsive: true,
            data: table_words,
            columns: [
                { defaultContent: '' },
                { data: 'position_in_text' },
                { data: 'word' },
                { data: 'level' }
            ],
            columnDefs: [{
                orderable: false,
                className: 'select-checkbox',
                targets: 0,
                checkboxes: {
                    selectRow: true
                }
            }],
            select: {
                style: 'multi',
                select: true
            },
            order: [[1, 'asc']],
            buttons: [
                {
                    extend: 'collection',
                    text: 'Selection Mode',
                    className: 'table_button',
                    buttons: [
                        {
                            extend: 'selectRows',
                            text: 'Row Selection Mode'
                        },
                        {
                            extend: 'selectColumns',
                            text: 'Column Selection Mode'
                        }
                    ]
                },
                {
                    extend: 'selectNone',
                    text: 'Deselect All',
                    className: 'table_button'
                },
                {
                    extend: 'collection',
                    text: 'Export Words',
                    className: 'table_button',
                    buttons: [
                        {
                            extend: 'collection',
                            text: 'Export Words - CSV',
                            buttons: [
                                {
                                    extend: 'csv',
                                    text: 'Only Whole Rows',
                                    exportOptions: {
                                        rows: '.selected'
                                    }
                                },
                                {
                                    extend: 'csv',
                                    text: 'Only Whole Columns',
                                    exportOptions: {
                                        columns: '.selected'
                                    }
                                },
                                {
                                    extend: 'csv',
                                    text: 'Only Ticked Words',
                                    exportOptions: {
                                        columns: [2],
                                        rows: '.selected'
                                    }
                                }
                            ]
                        },
                        {
                            extend: 'collection',
                            text: 'Export Words - PDF',
                            buttons: [
                                {
                                    extend: 'pdf',
                                    text: 'Only Whole Rows',
                                    exportOptions: {
                                        rows: '.selected'
                                    }
                                },
                                {
                                    extend: 'pdf',
                                    text: 'Only Whole Columns',
                                    exportOptions: {
                                        columns: '.selected'
                                    }
                                },
                                {
                                    extend: 'pdf',
                                    text: 'Only Ticked Words',
                                    exportOptions: {
                                        columns: [2],
                                        rows: '.selected'
                                    }
                                }
                            ]
                        },
                    ]
                },
                {
                    extend: 'collection',
                    text: 'Copy',
                    className: 'table_button',
                    buttons: [
                        {
                            extend: 'copy',
                            text: 'Only Whole Rows',
                            exportOptions: {
                                rows: '.selected'
                            }
                        },
                        {
                            extend: 'copy',
                            text: 'Only Whole Columns',
                            exportOptions: {
                                columns: '.selected'
                            }
                        },
                        {
                            extend: 'copy',
                            text: 'Only Ticked Words',
                            exportOptions: {
                                columns: [2],
                                rows: '.selected'
                            }
                        }
                    ]
                }
            ],
       });
    });
}