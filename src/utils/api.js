import axios from 'axios';

var functions = {
    getQuestionData: function(category) {
        return axios.get('http://api.dev.testingmom.com/question/?limit=173&app=473&category=' + category)
            .then(function(response) {
                return response.data.results;
            });
    }
}

export default functions;
