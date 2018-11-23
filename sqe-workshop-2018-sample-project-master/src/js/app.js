import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {convert1,convert2} from './parser';



$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));

        //my code
        let t=convert1(parsedCode);
        let s=convert2(t);
        document.getElementById('t').innerHTML=s;
    });
});


