// Reference mocha-typescript's global definitions:
/// <reference path="../node_modules/mocha-typescript/globals.d.ts" />

import { LogParser } from '../src/index';
import { assert } from 'chai';

@suite class UnitTest extends LogParser {
    @test "qweqwe"() {
        console.log("qweqwezxczxc");
        assert(true);
    }
}
