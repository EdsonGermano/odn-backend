'use strict';

const _ = require('lodash');

const Exception = require('../error');
const invalid = Exception.invalidParam;
const notFound = Exception.notFound;
const Constants = require('../constants');
const Stopwords = require('./../stopwords');
const AutosuggestSources = require('../../data/autosuggest-sources');
const createEntityRadixTree = require('./entity-radix-tree');
const createVariableRadixTree = require('./variable-radix-tree');
const EntitySuggest = require('./entity-suggest');
const QuestionSuggest = require('./question-suggest');
const ParseRequest = require('../parse-request');
const entitiesWithData = require('../entities-with-data');

module.exports = (request, response) => {
    const errorHandler = Exception.getHandler(request, response);
    const token = request.token;

    return Promise.all([
        ParseRequest.getQuery(request),
        getAutosuggestSource(request),
        getLimit(request)
    ]).then(([query, autosuggestSource, limit]) => {
        const variableID = request.query.variable_id;

        autosuggestSource.get(query, limit).then(options => {
            if (autosuggestSource.id === 'entity' && !_.isEmpty(variableID)) {
                entitiesWithData(token, options.options, variableID).then(entities => {
                    response.json({options: entities});
                }).catch(errorHandler);
            } else {
                response.json(options);
            }
        }).catch(errorHandler);
    }).catch(errorHandler);
};

const entityRadixTree = createEntityRadixTree();
const variableRadixTree = createVariableRadixTree();

const entitySuggest = entityRadixTree.then(tree => {
    return Promise.resolve(new EntitySuggest(tree));
});

const questionSuggest = Promise.all([
    entityRadixTree,
    variableRadixTree
]).then(([entityTree, variableTree]) => {
    return Promise.resolve(new QuestionSuggest(entityTree, variableTree));
});

function getAutosuggestSource(request) {
    let type = request.params.type;

    if (_.isNil(type))
        return Promise.reject(invalid('type of result to suggest required'));

    type = type.toLowerCase();

    if (type === 'entity') return entitySuggest;
    if (type === 'question') return questionSuggest;

    if (type in AutosuggestSources)
        return Promise.resolve(AutosuggestSources[type]);

    return Promise.reject(Exception.notFound(`suggest type not found: '${type}',
        must be in ${_.keys(AutosuggestSources).join(', ')}`));
}

function getLimit(request) {
    return ParseRequest.getLimit(request,
            Constants.SUGGEST_COUNT_DEFAULT,
            Constants.SUGGEST_COUNT_MAX);
}

