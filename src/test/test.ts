// Reference mocha-typescript's global definitions:
/// <reference path="../../node_modules/mocha-typescript/globals.d.ts" />

import {ConsoleStorage, IFactattribtype, LogParser} from '../index';
import {assert} from 'chai';
import {IFacttype} from "../i-facttype";
import {Readable} from "stream";
import {suite, test, timeout} from "mocha-typescript";
import {IFact} from "../i-fact";
import {IFactattrib} from "../i-factattrib";
import {TimeoutArray} from "../timeout-array";

@suite(timeout(2000))
class UnitTest extends LogParser {
    @test 'LogParser'(done) {


        let testData = `
2018-07-31T09:44:46.013Z;1471 start task
2018-07-31T09:44:46.014Z;1471 attrib 123
2018-07-31T09:44:46.013Z;1472 start task
2018-07-31T09:44:46.014Z;1472 attrib 321
2018-07-31T09:44:46.173Z;1471 end task
2018-07-31T09:44:46.173Z;1472 end task
2018-07-31T09:44:46.013Z;1473 start task
2018-07-31T09:44:46.014Z;1473 attrib 123
`;

        let facttypes = [
            <IFacttype> {
                name: 'test log',
                check: (line: string) => {
                    let regExp = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z);(\d+) start task$/g;
                    let regExpResult;
                    while (regExpResult = regExp.exec(line)) {
                        let start = new Date(regExpResult[1]);
                        let factNum = Number.parseInt(regExpResult[2]);
                        return <IFact>{
                            start,
                            name: 'test log',
                            end: null,
                            factattrib: [
                                <IFactattrib> {
                                    name: 'factNum',
                                    value: factNum
                                }
                            ]
                        };
                    }
                    return null
                },
                checkEnd: (line: string, fact: IFact) => {
                    try {
                        let regExp = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z);(\d+) end task$/g;
                        let regExpResult;
                        while (regExpResult = regExp.exec(line)) {
                            let end = new Date(regExpResult[1]);
                            let factNum = Number.parseInt(regExpResult[2]);
                            if (fact.name === 'test log') {
                                if (fact.factattrib.find(x => x.name === 'factNum').value === factNum) {
                                    return end;
                                }
                            }
                        }
                    }
                    catch (error) {
                        throw error;
                    }
                    return null
                },
                factattribtypes: [
                    <IFactattribtype>{
                        name: 'attrib',
                        check: (line: string, fact: IFact) => {
                            let regExp = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z);(\d+) attrib (\d+)$/g;
                            let regExpResult;
                            while (regExpResult = regExp.exec(line)) {
                                let date = new Date(regExpResult[1]);
                                let factNum = Number.parseInt(regExpResult[2]);
                                if (fact.name === 'test log') {
                                    if (fact.factattrib.find(x => x.name === 'factNum').value === factNum) {
                                        return <IFactattrib>{
                                            date,
                                            name: 'attrib',
                                            value: regExpResult[3],
                                        };
                                    }
                                }
                            }
                            return null
                        }
                    }
                ]
            }
        ];
        let stream = new Readable();
        stream.push(testData);
        stream.push(null);
        let logParser = new LogParser(facttypes, [new ConsoleStorage()], 600);

        logParser.parse(stream)
            .subscribe(
                (line) => {
                    console.log(`passed: ${line}`);
                },
                (error => {
                    done(error);
                }),
                () => {
                    assert(true);
                    done();
                }
            );
    }
}


@suite(timeout(2000))
class TimeoutArrayTest {
    @test 'TimeoutArray'(done) {
        const timeoutArray = new TimeoutArray<number>(200);
        timeoutArray.push(1);
        timeoutArray.push(2);

        const timeOutElements = [];

        timeoutArray.timeOutElement
            .subscribe((num) => {
                timeOutElements.push(num);
                if (timeOutElements.length === 1) {
                    assert.equal(timeOutElements[0], 2, 'timeOutElements 1 элемент 1');
                } else if (timeOutElements.length === 2) {
                    assert.equal(timeOutElements[0], 2, 'timeOutElements 2 элемент 1');
                    assert.equal(timeOutElements[1], 3, 'timeOutElements 2 элемент 2');
                } else {
                    throw new Error('timeOutElements error');
                }
            });

        setTimeout(() => {
            // todo
            //assert.to.be.equalTo([1, 2]);
            assert.equal(timeoutArray.length, 2, 'st 1 длина массива');
            assert.equal(timeoutArray[0], 1, 'st 1 элемент 1');
            assert.equal(timeoutArray[1], 2, 'st 1 элемент 2');
            timeoutArray.push(3);
            timeoutArray.splice(timeoutArray.indexOf(1), 1);
        }, 20);

        setTimeout(() => {
            assert.equal(timeoutArray.length, 2, 'st 2 длина массива');
            assert.equal(timeoutArray[0], 2, 'st 2 элемент 1');
            assert.equal(timeoutArray[1], 3, 'st 2 элемент 2');
        }, 190);

        setTimeout(() => {
            assert.equal(timeoutArray.length, 1, 'st 3 длина массива');
            assert.equal(timeoutArray[0], 3, 'st 3 элемент 1');
        }, 210);

        setTimeout(() => {
            assert.equal(timeoutArray.length, 0, 'st 4 длина массива');
        }, 230);

        setTimeout(() => {
            assert.equal(timeOutElements.length, 2, 'st 5 длина массива');
            assert.equal(timeOutElements[0], 2, 'st 5 элемент 1');
            assert.equal(timeOutElements[1], 3, 'st 5 элемент 2');
            done();
        }, 240);
    }
}
