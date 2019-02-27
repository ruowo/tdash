import test from 'ava'

import {Queue, QueueNotifyEvent} from '../src/queue'

test('queue', async t => {
  let info : QueueNotifyEvent<number> = <QueueNotifyEvent<number>>{}
	const q = new Queue<number>((data: QueueNotifyEvent<number>) => {
    info = data
  })
  q.push(1)
  t.is(info.data, 1)
  t.is(info.undoCount, 1)
  q.undo()
  t.is(info.data, 1)
  t.is(info.redoCount, 1)
  t.is(info.undoCount, 0)
  q.redo()
  t.is(info.data, 1)
  t.is(info.undoCount, 1)
  t.is(info.redoCount, 0)
  q.undo()

  q.push(2)
  t.is(info.data, 2)
  t.is(info.undoCount, 1)
  t.is(info.redoCount, 0)
  t.is(q.redo(), undefined)
  q.undo()
  t.is(q.undo(), undefined)

  q.beginGroup()
  q.push(1)
  q.push(2)
  q.push(3)
  q.endGroup()
  t.is(info.data, 3)
  t.is(info.undoCount, 1)
  t.is(info.redoCount, 0)
  t.is(q.redo(), undefined)
  q.undo()
  t.is(q.undo(), undefined)

  q.setLimit(2)
  q.push(1)
  q.push(2)
  q.push(3)
  q.push(4)
  t.is(info.data, 4)
  t.is(info.undoCount, 2)
  t.is(info.redoCount, 0)
  q.undo()
  q.undo()
  t.is(info.undoCount, 0)
  t.is(info.redoCount, 2)

  q.push(1)
  q.push(2)
  q.beginGroup()
  q.push(3)
  q.push(4)
  q.endGroup()
  t.is(info.data, 4)
  t.is(info.undoCount, 2)
  t.is(info.redoCount, 0)
  q.undo()
  q.redo()
  q.undo()
  q.undo()
  t.is(q.undo(), undefined)

})