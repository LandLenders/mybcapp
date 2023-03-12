import User from "./User.js";
import Network from "./Network.js";
import Note from "./Note.js";
import Favorite from "./Favorite.js";
import Contact from './Contact.js'
import NetworkContact from './NetworkContact.js'

User.hasMany(Favorite)
User.hasMany(Contact)
Contact.hasMany(Note)
User.hasMany(Network)
Network.belongsTo(User)
User.hasMany(Network)

Network.belongsToMany(Contact, {through: NetworkContact})
Contact.belongsToMany(Network,  {through: NetworkContact})

export{
    User, Network, Note, Favorite, Contact
}
