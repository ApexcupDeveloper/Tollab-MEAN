import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const subscribeToTopic = functions.https.onCall(
    async (data: { token: string, topic: string }, context) => {

        if (!context.auth) {
            // Throwing an HttpsError so that the client gets the error details.
            throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
        }

        if (!data.token || !data.token.length) {
            // Throwing an HttpsError so that the client gets the error details.
            throw new functions.https.HttpsError('failed-precondition', 'Token is null.');
        }
        if (!data.topic || !data.topic.length) {
            // Throwing an HttpsError so that the client gets the error details.
            throw new functions.https.HttpsError('failed-precondition', 'Topic is null.');
        }

        await admin.messaging().subscribeToTopic(data.token, data.topic);

        return `Subscribed to ${data.topic}`;
    }
);

export const unsubscribeFromTopic = functions.https.onCall(
    async (data: { token: string, topic: string }, context) => {

        if (!data.token || !data.token.length) {
            // Throwing an HttpsError so that the client gets the error details.
            throw new functions.https.HttpsError('failed-precondition', 'Token is null.');
        }
        if (!data.topic || !data.topic.length) {
            // Throwing an HttpsError so that the client gets the error details.
            throw new functions.https.HttpsError('failed-precondition', 'Topic is null.');
        }

        await admin.messaging().unsubscribeFromTopic(data.token, data.topic);

        return `Unsubscribed from ${data.topic}`;
    }
);

export const sendOnFirestoreCreate = functions.firestore
    .document('discounts/{discountId}')
    .onCreate(async snapshot => {
        const discount = snapshot.data();

        const notification: admin.messaging.Notification = {
            title: 'New Discount Available',
            body: (discount ? (discount.hasOwnProperty('headline') ? discount.headline : '') : '')
        };

        const payload: admin.messaging.Message = {
            notification,
            webpush: {
                notification: {
                    vibrate: [200, 100, 200],
                    actions: [
                        {
                            action: 'Yay!',
                            title: 'Like!'
                        },
                        {
                            action: 'dislike',
                            title: 'Boo!'
                        }
                    ]
                }
            },
            topic: 'discounts'
        };

        return admin.messaging().send(payload);
    });


