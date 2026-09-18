import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateFacilities,priceStats,summarizeQuotes,fleetConsumption,fleetDuplicateInfo,deriveMileage,propertyStatus,parkingTotals,parseNumericInput,filterRows,EXAMPLE_DATA} from '../modules/demos.mjs';

test('projected risk excludes zero and positive three cents, includes negative cents',()=>{
  const row={base:8000,amendments:0,posted:5599.97,average:600,missingMonths:4};
  assert.equal(calculateFacilities(row).projected,0.03);
  assert.equal(calculateFacilities(row).status,'covered');
  assert.equal(calculateFacilities({...row,posted:5600}).status,'covered');
  assert.equal(calculateFacilities({...row,posted:5600.01}).status,'risk');
  assert.equal(calculateFacilities({...row,posted:5600.001}).status,'covered');
});

test('missing forecast inputs remain pending; explicit zeros calculate',()=>{
  assert.equal(calculateFacilities({base:100,amendments:0,posted:10,average:null,missingMonths:2}).projected,null);
  assert.equal(calculateFacilities({base:100,amendments:null,posted:10,average:5,missingMonths:2}).status,'pending');
  assert.equal(calculateFacilities({base:0,amendments:0,posted:0,average:0,missingMonths:0}).projected,0);
  assert.equal(parseNumericInput(''),null);
  assert.equal(parseNumericInput('0'),0);
  assert.equal(parseNumericInput('  '),null);
  assert.equal(parseNumericInput('13,25'),13.25);
});

test('price statistics distinguish no quotes from valid zero quotes',()=>{
  assert.deepEqual(priceStats([null,null,null]),{count:0,mean:null,median:null});
  assert.deepEqual(priceStats([0,null,0]),{count:2,mean:0,median:0});
  assert.deepEqual(priceStats([42,45,43]),{count:3,mean:43.33,median:43});
});

test('an incomplete supplier never receives a comparable zero or partial total',()=>{
  const rows=[{suppliers:[0,20,null]},{suppliers:[0,null,10]}];
  const summary=summarizeQuotes(rows);
  assert.equal(summary[0].complete,true);
  assert.equal(summary[0].total,0);
  assert.equal(summary[1].complete,false);
  assert.equal(summary[1].total,null);
  assert.equal(summary[1].partial,20);
  assert.equal(summary[2].total,null);
  assert.ok(summarizeQuotes([]).every(quote=>!quote.complete&&quote.total===null));
});

test('washes never produce consumption alarms, and imported thresholds are strict',()=>{
  assert.equal(fleetConsumption({type:'wash',importedKm:0,importedKmL:0}),'wash');
  assert.equal(fleetConsumption({type:'fuel',importedKm:0,importedKmL:8}),'check');
  assert.equal(fleetConsumption({type:'fuel',importedKm:100,importedKmL:null}),'pending');
  assert.equal(fleetConsumption({type:'fuel',importedKm:100,importedKmL:4.99}),'high');
  assert.equal(fleetConsumption({type:'fuel',importedKm:100,importedKmL:5}),'ok');
  assert.equal(fleetConsumption({type:'fuel',importedKm:100,importedKmL:20}),'ok');
  assert.equal(fleetConsumption({type:'fuel',importedKm:100,importedKmL:20.01}),'low');
});

test('financial duplicate review sums every candidate; day matches are separate',()=>{
  const row={id:'a',entity:'DEMO-A',date:'2026-09-12',driver:'DEMO-D',station:'DEMO-S',type:'fuel',amount:100};
  const duplicate={...row,id:'b'};
  const wash={...row,id:'c',type:'wash',amount:20};
  const result=fleetDuplicateInfo([row,duplicate,wash]);
  assert.equal(result.reviewAmount,200);
  assert.equal(result.reviewCount,2);
  assert.equal(result.financeIds.size,2);
  assert.equal(result.dayIds.size,3);
  assert.equal(result.financeIds.has('c'),false);
  assert.equal(fleetDuplicateInfo([{...row,amount:100.004},duplicate]).reviewAmount,200);
  assert.equal(fleetDuplicateInfo([{...row,amount:null},{...duplicate,amount:null}]).financeIds.size,0);
});

test('educational odometer delta excludes washing and retains valid anchor after regression',()=>{
  const base={entity:'DEMO-A',type:'fuel'};
  const result=deriveMileage([
    {...base,id:'a',date:'2026-09-01',odometer:1000},
    {...base,id:'b',date:'2026-09-02',type:'wash',odometer:1100},
    {...base,id:'c',date:'2026-09-03',odometer:1250},
    {...base,id:'d',date:'2026-09-04',odometer:1200},
    {...base,id:'e',date:'2026-09-05',odometer:1400},
    {...base,id:'f',date:'2026-09-06',odometer:9000},
  ]);
  assert.equal(result.get('b').km,null);
  assert.equal(result.get('c').km,250);
  assert.equal(result.get('d').status,'check');
  assert.equal(result.get('e').km,150);
  assert.equal(result.get('f').km,null);
});

test('property due date logic does not imply payment confirmation',()=>{
  const row={protocol:'DEMO-P',due:'2026-09-01',amount:500,posted:0};
  assert.equal(propertyStatus(row),'late');
  assert.equal(propertyStatus({...row,posted:1}),'posted');
  assert.equal(propertyStatus({...row,due:null}),'missingDue');
  assert.equal(propertyStatus({...row,amount:null}),'pending');
});

test('parking totals do not convert global contracts or infer missing spaces',()=>{
  const totals=parkingTotals([{type:'monthly',amount:100,slots:null},{type:'global',amount:12000,slots:4},{type:'monthly',amount:0,slots:0},{type:'monthly',amount:900,slots:2,linked:false}]);
  assert.deepEqual(totals,{monthly:100,global:12000,knownSlots:4,missingSlots:1});
  assert.equal(parkingTotals([{type:'global',amount:null,slots:null}]).global,null);
  assert.equal(parkingTotals([{type:'global',amount:null,slots:null}]).knownSlots,null);
});

test('filters combine independently and impossible combinations stay empty',()=>{
  const rows=EXAMPLE_DATA.frota;
  assert.equal(filterRows(rows,{period:'2026-09',entity:'DEMO-V01',type:'wash'}).length,1);
  assert.equal(filterRows(rows,{period:'2026-07',entity:'DEMO-V01',type:'wash'}).length,0);
  assert.ok(filterRows(EXAMPLE_DATA.facilities,{type:'material'}).every(row=>row.type==='material'));
});
