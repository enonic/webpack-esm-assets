import test from 'ava';
import {
  toEntryKey,
  toEntryValue
} from '../src/index.es';


const TEST_PATH = 'src/main/resources/assets/js/react/Collector.jsx';


test('entryKey', t => {
  const expected = 'js/react/Collector';
  const actual = toEntryKey(TEST_PATH);
  console.debug('expected:', expected);
  console.debug('  actual:', actual);
  t.is(expected, actual);
});


test('entryValue', t => {
  const expected = './js/react/Collector.jsx';
  const actual = toEntryValue(TEST_PATH);
  console.debug('expected:', expected);
  console.debug('  actual:', actual);
  t.is(expected, actual);
});
