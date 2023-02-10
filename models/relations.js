import User from "./User.js";
import Network from "./Network.js";
import Note from "./Note.js";
import Favorite from "./Favorite.js";
import Contact from './Contact.js'

User.hasMany(Favorite)
User.hasMany(Contact)
Contact.hasMany(Note)
User.hasMany(Network)
Network.hasMany(Contact)

export{
    User, Network, Note, Favorite, Contact
}
