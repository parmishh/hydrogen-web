/*
Copyright 2020 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

function encodeKey(senderKey, sessionId) {
    return `${senderKey}|${sessionId}`;
}

export class OlmSessionStore {
    constructor(store) {
        this._store = store;
    }

    getAll(senderKey) {
        const range = IDBKeyRange.lowerBound(encodeKey(senderKey, ""));
        return this._store.selectWhile(range, session => {
            return session.senderKey === senderKey;
        });
    }

    get(senderKey, sessionId) {
        return this._store.get(encodeKey(senderKey, sessionId));
    }

    set(session) {
        session.key = encodeKey(session.senderKey, session.sessionId);
        return this._store.put(session);
    }

    remove(senderKey, sessionId) {
        return this._store.delete(encodeKey(senderKey, sessionId));
    }
}
