import test from 'ava';
import {
  toEntryKey,
  toEntryValue
} from '../src/index.es';


const TEST_PATH = 'src/main/resources/assets/js/react/Collector.jsx';


test('entryKey', t => {
  t.is('js/react/Collector',toEntryKey(TEST_PATH));
});


test('entryValue', t => {
  t.is('./js/react/Collector.jsx',toEntryValue(TEST_PATH));
});
