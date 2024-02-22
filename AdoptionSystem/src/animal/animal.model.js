import {Schema, model} from 'mongoose'
 
const animalSchema = Schema({
    name:{
        type: String,
        required: true,
        required: true
    },
 
    race:{  
        type: String,
        required: true
    },
   
    age:{
        type: String,
        required: true
    },
 
    gender:{
        type:String,
        required: true
    },
    
    keeper:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
})
 
export default model('animal',animalSchema)