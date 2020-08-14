import { MongoClient, Db, ObjectID } from "mongodb";
import { type } from "os";

const client = new MongoClient("mongodb+srv://admin:admin@cluster0.vlznh.mongodb.net/userlist?retryWrites=true&w=majority", { useUnifiedTopology: true });
let connected = false;
let dbo: Db;
const db = "kebotest", collection = "accounts1";
export async function connect() {
    await client.connect();
    dbo = client.db(db);
    connected = true;
}

export async function addAccount(account: accountSpotify, _id: ObjectID) {
    if (!connected)
        return;
    return await
        dbo.collection(collection)
            .updateOne({
                _id: _id
            },
                {
                    $set: {
                        subs: {
                            spotify: account
                        }
                    }
                });
}

export async function inUseAccount(_id: ObjectID, inUse: boolean = true) {
    if (!connected)
        return;
    return await
        dbo.collection(collection)
            .updateOne(
                { _id: _id },
                { $set: { inUsed: inUse } }
            )
}

export async function setReal(_id: ObjectID, real: string){
    if(!connected)
        return
    return await
        dbo.collection(collection)
            .updateOne(
                { _id: _id },
                { $set: { "subs.spotify.realCountry": real } }
            )
}

export async function alreadyExists(_id: ObjectID){
    if(!connected)
        return
    return dbo.collection(collection)
                .updateOne(
                    {_id: _id},
                    { $set: {"subs.spotify.alreadyExists": true }}
                )
}

export async function findNotRegisterAccount() {
    if (!connected)
        return;
    return <account>(await
        dbo.collection(collection)
            .findOne({
                $and: [
                    { activated: true },
                    {
                        $or: [
                            { subs: { $exists: false } },
                            { subs: { spotify: { $exists: false } } }
                        ]
                    },
                    { 
                        $or: [
                            { inUsed: false },
                            { inUsed: { $exists: false } }
                        ]
                    }
                ]
            }));
}

export type accountSpotify = {
    country?: string,
    vpn?: string,
    username: string,
    password: string,
    gender: gender,
    birthday: date
    verified: boolean,
    changedCountry?: string
};

export type account = {
    _id: string | ObjectID,
    name: string,
    surname: string,
    email: string,
    password: string,
    extension: string,
    activated: boolean,
    country: string,
    subs?: {}
};

export type gender = "m" | "f" | "x";
export type date = {
    year: number,
    month: months,
    day: number
};

export type months = "gen" | "feb" | "mar" | "apr" | "mag" | "giu" | "lug" | "ago" | "set" | "ott" | "nov" | "dic"; 