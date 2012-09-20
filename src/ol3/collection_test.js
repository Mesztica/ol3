goog.require('goog.array');
goog.require('goog.testing.jsunit');
goog.require('ol3.Collection');
goog.require('ol3.CollectionEventType');


function testEmpty() {
  var collection = new ol3.Collection();
  assertEquals(0, collection.getLength());
  assertTrue(goog.array.equals(collection.getArray(), []));
  assertUndefined(collection.getAt(0));
}


function testConstruct() {
  var array = [0, 1, 2];
  var collection = new ol3.Collection(array);
  assertEquals(0, collection.getAt(0));
  assertEquals(1, collection.getAt(1));
  assertEquals(2, collection.getAt(2));
}


function testPush() {
  var collection = new ol3.Collection();
  collection.push(1);
  assertEquals(1, collection.getLength());
  assertTrue(goog.array.equals(collection.getArray(), [1]));
  assertEquals(1, collection.getAt(0));
}


function testPushPop() {
  var collection = new ol3.Collection();
  collection.push(1);
  collection.pop();
  assertEquals(0, collection.getLength());
  assertTrue(goog.array.equals(collection.getArray(), []));
  assertUndefined(collection.getAt(0));
}


function testInsertAt() {
  var collection = new ol3.Collection([0, 2]);
  collection.insertAt(1, 1);
  assertEquals(0, collection.getAt(0));
  assertEquals(1, collection.getAt(1));
  assertEquals(2, collection.getAt(2));
}


function testSetAt() {
  var collection = new ol3.Collection();
  collection.setAt(1, 1);
  assertEquals(2, collection.getLength());
  assertUndefined(collection.getAt(0));
  assertEquals(1, collection.getAt(1));
}


function testRemoveAt() {
  var collection = new ol3.Collection([0, 1, 2]);
  collection.removeAt(1);
  assertEquals(0, collection.getAt(0));
  assertEquals(2, collection.getAt(1));
}


function testForEachEmpty() {
  var collection = new ol3.Collection();
  var forEachCalled = false;
  collection.forEach(function() {
    forEachCalled = true;
  });
  assertFalse(forEachCalled);
}


function testForEachPopulated() {
  var collection = new ol3.Collection();
  collection.push(1);
  collection.push(2);
  var forEachCount = 0;
  collection.forEach(function() {
    ++forEachCount;
  });
  assertEquals(2, forEachCount);
}


function testSetAtEvent() {
  var collection = new ol3.Collection(['a', 'b']);
  var index, prev;
  goog.events.listen(collection, ol3.CollectionEventType.SET_AT, function(e) {
    index = e.index;
    prev = e.prev;
  });
  collection.setAt(1, 1);
  assertEquals(1, index);
  assertEquals('b', prev);
}


function testRemoveAtEvent() {
  var collection = new ol3.Collection(['a']);
  var index, prev;
  goog.events.listen(
      collection, ol3.CollectionEventType.REMOVE_AT, function(e) {
        index = e.index;
        prev = e.prev;
      });
  collection.pop();
  assertEquals(0, index);
  assertEquals('a', prev);
}


function testInsertAtEvent() {
  var collection = new ol3.Collection([0, 2]);
  var index;
  goog.events.listen(
      collection, ol3.CollectionEventType.INSERT_AT, function(e) {
        index = e.index;
      });
  collection.insertAt(1, 1);
  assertEquals(1, index);
}


function testSetAtBeyondEnd() {
  var collection = new ol3.Collection();
  var inserts = [];
  goog.events.listen(
      collection, ol3.CollectionEventType.INSERT_AT, function(e) {
        inserts.push(e.index);
      });
  collection.setAt(2, 0);
  assertEquals(3, collection.getLength());
  assertUndefined(collection.getAt(0));
  assertUndefined(collection.getAt(1));
  assertEquals(0, collection.getAt(2));
  assertEquals(3, inserts.length);
  assertEquals(0, inserts[0]);
  assertEquals(1, inserts[1]);
  assertEquals(2, inserts[2]);
}


function testLengthChangeInsertAt() {
  var collection = new ol3.Collection([0, 1, 2]);
  var lengthEventDispatched;
  goog.events.listen(collection, 'length_changed', function() {
    lengthEventDispatched = true;
  });
  collection.insertAt(2, 3);
  assertTrue(lengthEventDispatched);
}


function testLengthChangeRemoveAt() {
  var collection = new ol3.Collection([0, 1, 2]);
  var lengthEventDispatched;
  goog.events.listen(collection, 'length_changed', function() {
    lengthEventDispatched = true;
  });
  collection.removeAt(0);
  assertTrue(lengthEventDispatched);
}


function testLengthChangeSetAt() {
  var collection = new ol3.Collection([0, 1, 2]);
  var lengthEventDispatched;
  goog.events.listen(collection, 'length_changed', function() {
    lengthEventDispatched = true;
  });
  collection.setAt(1, 1);
  assertUndefined(lengthEventDispatched);
}


function testForEach() {
  var collection = new ol3.Collection([1, 2, 4]);
  var sum = 0;
  collection.forEach(function(elem) {
    sum += elem;
  });
  assertEquals(7, sum);
}


function testForEachScope() {
  var collection = new ol3.Collection([0]);
  var that;
  var uniqueObj = {};
  collection.forEach(function(elem) {
    that = this;
  }, uniqueObj);
  assertTrue(that === uniqueObj);
}


function testAddEvent() {
  var collection = new ol3.Collection();
  var elem;
  goog.events.listen(collection, ol3.CollectionEventType.ADD, function(e) {
    elem = e.elem;
  });
  collection.push(1);
  assertEquals(1, elem);
}


function testAddRemoveEvent() {
  var collection = new ol3.Collection([1]);
  var addedElem;
  goog.events.listen(collection, ol3.CollectionEventType.ADD, function(e) {
    addedElem = e.elem;
  });
  var removedElem;
  goog.events.listen(collection, ol3.CollectionEventType.REMOVE, function(e) {
    removedElem = e.elem;
  });
  collection.setAt(0, 2);
  assertEquals(1, removedElem);
  assertEquals(2, addedElem);
}


function testRemove() {
  var collection = new ol3.Collection([1]);
  var elem;
  goog.events.listen(collection, ol3.CollectionEventType.REMOVE, function(e) {
    elem = e.elem;
  });
  collection.pop();
  assertEquals(1, elem);
}