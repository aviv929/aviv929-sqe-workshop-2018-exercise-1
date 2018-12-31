import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {convert1,convert2} from '../src/js/parser';

var data,expected;
describe('Tests for the parsed data: ', () => {

    it('empty data', () => {
        data=convert1(parseCode(''));
        expected=[];
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('function declaration test', () => {
        data=convert1(parseCode('function test(){}'));
        expected=[[1,'function declaration','test','','']];
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('function declaration with params test', () => {
        data=convert1(parseCode('function test(a,b){}'));
        expected=[[1,'function declaration','test','',''],[1,'variable declaration','a','',''],[1,'variable declaration','b','','']];
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('variable declaration test', () => {
        data=convert1(parseCode('let a;'));
        expected=[[1,'variable declaration','a','',null]];
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('variable declaration with initialize test', () => {
        data=convert1(parseCode('let a=1;'));
        expected=[[1,'variable declaration','a','',1]];
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('assignment literal expression test', () => {
        data=convert1(parseCode('a=1;'));
        expected=[[1,'assignment expression','a','',1]];
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('assignment identifier expression test', () => {
        data=convert1(parseCode('a=x;'));
        expected=[[1,'assignment expression','a','','x']];
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('assignment unary expression test', () => {
        data=convert1(parseCode('a=-1;'));
        expected=[[1,'assignment expression','a','','(-1)']];
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('assignment member expression test', () => {
        data=convert1(parseCode('a[1]=3;'));
        expected=[[1,'assignment expression','a[1]','',3]];
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('assignment binary expression test', () => {
        data=convert1(parseCode('a=3+x;'));
        expected=[[1,'assignment expression','a','','(3+x)']];
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('assignment complex binary expression test', () => {
        data=convert1(parseCode('a=2+(3+x)/2;'));
        expected=[[1,'assignment expression','a','','(2+((3+x)/2))']];
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('while statement test', () => {
        data=convert1(parseCode('while(a==b){}'));
        expected=[[1,'while statement','','(a==b)','']];
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('while statement with body test', () => {
        data=convert1(parseCode('while(a==b)\n' +
            '{\n' +
            '   let a=1;\n' +
            '}'));
        expected=[[1,'while statement','','(a==b)',''],[3,'variable declaration','a','',1]];
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('if statement test', () => {
        data=convert1(parseCode('if(a==b){}'));
        expected=[[1,'if statement','','(a==b)','']];
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('if statement with body test', () => {
        data=convert1(parseCode('if(a==b)\n' +
            '   a=1;\n'));
        expected=[[1,'if statement','','(a==b)',''],[2,'assignment expression','a','',1]];
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('if and else if statement test', () => {
        data=convert1(parseCode('if(a==b)\n' +
            '   a=1;\n' +
            'else if(a+1==b)\n' +
            '   a=1;\n'));
        expected=[[1,'if statement','','(a==b)',''],[2,'assignment expression','a','',1],[3,'else if statement','','((a+1)==b)',''],[4,'assignment expression','a','',1]];
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('if , else if and else statement test', () => {
        data=convert1(parseCode('if(a==b)\n' +
            '   a=1;\n' +
            'else if(a+1==b)\n' +
            '   a=1;\n' +
            'else\n' +
            '   a=1;\n'));
        expected=[[1,'if statement','','(a==b)',''],[2,'assignment expression','a','',1],
            [3,'else if statement','','((a+1)==b)',''],[4,'assignment expression','a','',1],
            [5,'else statement','','',''],[6,'assignment expression','a','',1]];
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('for statement test', () => {
        data=convert1(parseCode('for(i=0;i<9;i=i+1){}'));
        expected=[[1,'for statement','i=0','(i<9)','i=(i+1)']];
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('return statement test', () => {
        data=convert1(parseCode('function test()\n' +
            '{\n' +
            '   return x;\n' +
            '}\n' +
            '\n' +
            '\n'));
        expected=[[1,'function declaration','test','',''],[3,'return statement','','','x']];
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('complex code test', () => {
        data=convert1(parseCode('function test()\n' +
            '{\n' +
            '   a=5;\n' +
            '   a=6;\n' +
            '}'));
        expected=[[1,'function declaration','test','',''],[3,'assignment expression','a','',5],[4,'assignment expression','a','',6]];
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

});

describe('Tests for the parsed table: ', () => {

    it('empty data', () => {
        data=convert2(convert1(parseCode('')));
        expected='<tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr>';
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('one row table', () => {
        data=convert2(convert1(parseCode('for(i=0;i<9;i=i+1){}')));
        expected='<tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr>'+
            '<tr><td>1</td><td>for statement</td><td>i=0</td><td>(i<9)</td><td>i=(i+1)</td></tr>';
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

    it('multy row table', () => {
        data=convert2(convert1(parseCode('for(i=0;i<9;i=i+1)\n' +
            '{\n' +
            '   a=1;\n' +
            '}')));
        expected='<tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr>'+
            '<tr><td>1</td><td>for statement</td><td>i=0</td><td>(i<9)</td><td>i=(i+1)</td></tr>'+
            '<tr><td>3</td><td>assignment expression</td><td>a</td><td></td><td>1</td></tr>';
        assert.equal(
            JSON.stringify(data),
            JSON.stringify(expected)
        );
    });

});
