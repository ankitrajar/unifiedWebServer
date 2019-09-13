const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    serviceName:{
        type:String,
        required: 'This field is required'
    },
});

serviceSchema.set('toJSON', { virtuals: true });
mongoose.model('Service',serviceSchema);
