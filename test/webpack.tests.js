/* jshint esversion: 6 */
import test from 'tape';

import {BrowseDown} from '../src';
import simple from './simple_spec';


const factory = (name) => new BrowseDown(name);

simple.all(test, factory);