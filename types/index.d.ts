import {Integer, Node as Neo4jNode, QueryResult, Session, Transaction} from 'neo4j-driver';

declare class Neode {
    schema: Neode.Schema;
    models: Neode.ModelMap;

    /**
     * Constructor
     *
     * @param  {String} connection_string
     * @param  {String} username
     * @param  {String} password
     * @param  {Bool}   enterprise
     * @param  {String} database
     * @param  {Object} config
     * @return {Neode}
     */
    constructor(connection_string: string, username: string, password: string, enterprise?: boolean, database?: string, config?: object);


    /**
     * @static
     * Generate Neode instance using .env configuration
     *
     * @return {Neode}
     */
    static fromEnv(): Neode;

    /**
     * Define multiple models
     *
     * @param  {Object} models   Map of models with their schema.  ie {Movie: {...}}
     * @return {Neode}
     */
    with(models: { [index: string]: Neode.SchemaObject }): Neode;

    /**
     * Scan a directory for Models
     *
     * @param  {String} directory   Directory to scan
     * @return {Neode}
     */
    withDirectory(directory: string): Neode;

    /**
     * Set Enterprise Mode
     *
     * @param {Bool} enterprise
     */
    setEnterprise(enterprise: boolean): void;

    /**
     * Are we running in enterprise mode?
     *
     * @return {Bool}
     */
    enterprise(): boolean;

    /**
     * Define a new Model
     *
     * @param  {String} name
     * @param  {Object} schema
     * @return {Model}
     */
    model<T>(name: string, schema?: Neode.SchemaObject): Neode.Model<T>;

    /**
     * Extend a model with extra configuration
     *
     * @param  {String} name   Original Model to clone
     * @param  {String} as     New Model name
     * @param  {Object} using  Schema changes
     * @return {Model}
     */
    extend<T>(model: string, as: string, using: Neode.SchemaObject): Neode.Model<T>;

    /**
     * Create a new Node of a type
     *
     * @param  {String} model
     * @param  {Object} properties
     * @return {Node}
     */
    create<T>(model: string, properties: object): Promise<Neode.Node<T>>;

    /**
     * Merge a node based on the defined indexes
     *
     * @param  {Object} properties
     * @return {Promise}
     */
    merge<T>(model: string, properties: object): Promise<Neode.Node<T>>;

    /**
     * Merge a node based on the supplied properties
     *
     * @param  {Object} match Specific properties to merge on
     * @param  {Object} set   Properties to set
     * @return {Promise}
     */
    mergeOn<T>(model: string, match: object, set: object): Promise<Neode.Node<T>>;

    /**
     * Delete a Node from the graph
     *
     * @param  {Node} node
     * @return {Promise}
     */
    delete(node: Neode.Node<any>): Promise<void>;

    /**
     * Delete all node labels
     *
     * @param  {String} label
     * @return {Promise}
     */
    deleteAll(model: string): Promise<void>;

    /**
     * Relate two nodes based on the type
     *
     * @param  {Node}   from        Origin node
     * @param  {Node}   to          Target node
     * @param  {String} type        Type of Relationship definition
     * @param  {Object} properties  Properties to set against the relationships
     * @param  {Boolean} force_create   Force the creation a new relationship? If false, the relationship will be merged
     * @return {Promise}
     */
    relate<T, U>(from: Neode.Node<T>, to: Neode.Node<U>, type: string, properties: Neode.RelationshipSchema, force_create ?: boolean): Promise<Neode.Relationship>;

    /**
     * Run an explicitly defined Read query
     *
     * @param  {String} query
     * @param  {Object} params
     * @return {Promise}
     */
    readCypher(query: string, params: object): Promise<QueryResult>;

    /**
     * Run an explicitly defined Write query
     *
     * @param  {String} query
     * @param  {Object} params
     * @return {Promise}
     */
    writeCypher(query: string, params: object): Promise<QueryResult>;

    /**
     * Run a Cypher query
     *
     * @param  {String} query
     * @param  {Object} params
     * @return {Promise}
     */
    cypher(query: string, params: object, session?: Session): Promise<QueryResult>;

    /**
     * Create a new Session in the Neo4j Driver.
     *
     * @param {String} database
     * @return {Session}
     */
    session(): Session;

    /**
     * Create an explicit Read Session
     *
     * @param {String} database
     * @return {Session}
     */
    readSession(database?: string): Session;

    /**
     * Create an explicit Write Session
     *
     * @param {String} database
     * @return {Session}
     */
    writeSession(database?: string): Session;

    /**
     * Create a new Transaction
     *
     * @param {String} mode
     * @param {String} database
     * @return {Transaction}
     */
    transaction(mode?: string, database?: string): Transaction;

    /**
     * Run a batch of queries within a transaction
     *
     * @type {Array}
     * @return {Promise}
     */
    batch(queries?: Array<{ query: string | object, params?: object | string }>): Promise<any>;

    /**
     * Close Driver
     *
     * @return {void}
     */
    close(): void;

    /**
     * Return a new Query Builder
     *
     * @return {Builder}
     */
    query(): Neode.Builder;

    /**
     * Get a collection of nodes
     *
     * @param  {String}              label
     * @param  {Object}              properties
     * @param  {String|Array|Object} order
     * @param  {Int}                 limit
     * @param  {Int}                 skip
     * @return {Promise}
     */
    all(label: string, properties?: object, order?: string | Array<any> | object, limit?: number, skip?: number): Promise<Neode.EntityCollection>;

    /**
     * Find a Node by it's label and primary key
     *
     * @param  {String} label
     * @param  {mixed}  id
     * @return {Promise}
     */
    find<T>(label: string, id: string | number): Promise<Neode.Node<T>>;

    /**
     * Find a Node by it's internal node ID
     *
     * @param  {String} model
     * @param  {int}    id
     * @return {Promise}
     */
    findById<T>(label: string, id: number): Promise<Neode.Node<T>>;

    /**
     * Find a Node by properties
     *
     * @param  {String} label
     * @param  {mixed}  key     Either a string for the property name or an object of values
     * @param  {mixed}  value   Value
     * @return {Promise}
     */
    first<T>(label: string, key: string | { [key: string]: any }, value: any): Promise<Neode.Node<T>>;

    /**
     * Hydrate a set of nodes and return a NodeCollection
     *
     * @param  {Object}          res            Neo4j result set
     * @param  {String}          alias          Alias of node to pluck
     * @param  {Definition|null} definition     Force Definition
     * @return {NodeCollection}
     */
    hydrate<T>(res: QueryResult, alias: string, definition?: Neode.Model<T>): Neode.EntityCollection;

    /**
     * Hydrate the first record in a result set
     *
     * @param  {Object} res    Neo4j Result
     * @param  {String} alias  Alias of Node to pluck
     * @return {Node}
     */
    hydrateFirst<T>(res: QueryResult, alias: string, definition?: Neode.Model<T>): Neode.Node<T>;

}

export = Neode;

declare namespace Neode {

    type PropertyType = string | number | boolean;

    type TemporalPropertyTypes = 'datetime' | 'date' | 'time' | 'localdate' | 'localtime' | 'duration'
    type NumberPropertyTypes = 'number' | 'int' | 'integer' | 'float'
    type RelationshipPropertyTypes = 'relationship' | 'relationships'
    type NodesPropertyTypes = 'node' | 'nodes'
    type StringPropertyTypes = 'string' | 'uuid'
    type PropertyTypes = TemporalPropertyTypes | NumberPropertyTypes
        | RelationshipPropertyTypes | StringPropertyTypes | NodesPropertyTypes
        | 'boolean' | 'Point';

    type Direction = 'direction_in' | 'direction_out' | 'direction_both' | 'in' | 'out';

    interface BaseNodeProperties {
        primary?: boolean
        required?: boolean
        unique?: boolean
        index?: boolean

        /**
         * Will not be returned when using `Node.toJson()`
         */
        hidden?: boolean
        readonly?: boolean
        default?: any
    }

    interface BaseNumberNodeProperties extends BaseNodeProperties {
        /**
         * Minimum value of the number
         */
        min: number

        /**
         * Maximum value of the number
         */
        max: number

        /**
         * Is the number an integer
         */
        integer: boolean

        /**
         * Can the number handle positive value
         */
        positive: boolean

        /**
         * Can the number handle negative value
         */
        negative: boolean

        /**
         * The number has to be a multiple of
         */
        multiple: number
    }

    interface NumberNodeProperties extends BaseNumberNodeProperties {
        type: 'number'
    }

    interface IntNodeProperties extends BaseNumberNodeProperties {
        type: 'int'
    }

    interface IntegerNodeProperties extends BaseNumberNodeProperties {
        type: 'integer'
    }

    interface FloatNodeProperties extends BaseNumberNodeProperties {
        type: 'float'

        /**
         * Precision, decimal count
         */
        precision: number
    }

    interface StringNodeProperties extends BaseNodeProperties {
        type: 'string'

        regex: RegExp | {
            pattern: RegExp
            invert: boolean
            name: string
        }

        /**
         * Replace parts of the string
         */
        replace: {
            /**
             * RegExp pattern
             */
            pattern: RegExp

            /**
             * What should replace the pattern
             */
            replace: string
        }

        /**
         * Should the string be in a valid email format
         */
        email: boolean | {
            /**
             * tld Domain whitelist (e.g ['com', 'fr'])
             */
            tldWhitelist: string[]
        }
    }

    interface BaseRelationshipNodeProperties extends BaseNodeProperties {
        /**
         * Neo4J Relationship name (e.g: ACTED_IN)
         */
        relationship: string

        /**
         * Target model name
         */
        target: string

        /**
         * Is the relation required to be fetch
         */
        required?: boolean

        /**
         * Load the relation with the parent object
         */
        eager?: boolean

        /**
         * Default value
         */
        default?: any

        /**
         * Relationship direction
         */
        direction: Direction

        /**
         * Behaviour when deleting the parent object
         */
        cascade?: 'detach' | 'delete'

        /**
         * Relationship attached properties
         */
        properties?: {
            [index: string]: PropertyTypes
        }
    }

    /**
     * Relationship definition for multiple relationships
     * When getting the value of the relationship, a `NodeCollection` object will be returned
     * @example
     * let movie = neode.first('Movie', {title: 'The Matrix'})
     * let actors = movie.get('actors')
     * // Actors is an EntityCollection object
     */
    interface RelationshipsNodeProperties extends BaseRelationshipNodeProperties {
        type: 'relationships'
    }

    /**
     * Relationship definition for a single relationship
     * When getting the value of the relationship, a `Relationship` object will be returned
     * @example
     * let movie = neode.first('Movie', {title: 'The Matrix'})
     * // Director is a Relationship object
     */
    interface RelationshipNodeProperties extends BaseRelationshipNodeProperties {
        type: 'relationship'
    }

    interface NodesNodeProperties extends BaseRelationshipNodeProperties {
        type: 'nodes'
    }

    interface NodeNodeProperties extends BaseRelationshipNodeProperties {
        type: 'node'
    }

    interface OtherNodeProperties extends BaseNodeProperties {
        type: PropertyTypes
    }

    /**
     * Technically a full text index is disrelated to Node and is only for searching. However, it still augments Node definitions,
     * so it is included here.
     *
     * If my understanding is correct, if you specify multiple models/relations, all of them need to have the specified properties.
     */
    interface BaseFullTextIndexProperties extends BaseNodeProperties {
        options?: {
            indexConfig: {
                /**
                 * Type of analyzer to use. Has different options for processing and scoring text.
                 * You can find a list by running `CALL db.index.fulltext.listAvailableAnalyzers` in your Neo4J console.
                 */
                ['fulltext.analyzer']: 'english' | 'standard' | 'simple' | 'whitespace' | 'stop' | 'keyword' | 'standard-folding',

                /**
                 * Should the index be updated in the background at the earliest possible time?
                 * (That isn't in the same transaction as the query)
                 */
                ['fulltext.eventually_consistent']: boolean,
            }
        },
        properties: string[],
    }

    /**
     * Queries using the db.index.fulltext.queryNodes procedure.
     */
    interface NodeFullTextIndexProperties extends BaseFullTextIndexProperties {
        type: 'nodeFulltext',
        models: string[],
    }

    /**
     * Queries using the db.index.fulltext.queryRelationships procedure.
     */
    interface RelationshipFullTextIndexProperties extends BaseFullTextIndexProperties {
        type: 'relationshipFulltext',
        relations: string[],
    }

    interface VectorNodeProperties extends BaseNodeProperties {
        type: 'vector',
        vectorIndex?: boolean | {
            name?: string, // Defaults to idx_{propertyName}_vector
            dimensions?: number, // Defaults to 1536
            similarity_function?: 'cosine' | 'euclidean',
        },
        dtype: 'float' | 'int', // Defaults to float
    }

    type NodeProperty = PropertyTypes
        | NumberNodeProperties | IntNodeProperties | IntegerNodeProperties | FloatNodeProperties
        | RelationshipNodeProperties | RelationshipsNodeProperties
        | NodeNodeProperties | NodesNodeProperties
        | StringNodeProperties | OtherNodeProperties |
        NodeFullTextIndexProperties | RelationshipFullTextIndexProperties | VectorNodeProperties;

    export type SchemaObject = {
        [index: string]: NodeProperty
    };

    export type RelationshipSchema = {
        [index: string]: BaseRelationshipNodeProperties
    };


    type Mode = 'READ' | 'WRITE';

    class Builder {

        public _params: Record<string, any>;

        constructor(neode: Neode);

        /**
         * Start a new Query segment and set the current statement
         *
         * @return {Builder}
         */
        statement(prefix: string): Builder;

        /**
         * Start a new Where Segment
         *
         * @return {Builder}
         */
        whereStatement(prefix: string, connector?: 'AND' | 'OR'): Builder;

        /**
         * Match a Node by a definition
         *
         * @param  {String} alias      Alias in query
         * @param  {Model}  model      Model definition
         * @return {Builder}           Builder
         */
        match<T>(alias: string, model: Model<T> | false): Builder;

        optionalMatch<T>(alias: string, model?: Model<T> | false): Builder;

        /**
         * Add a 'with' statement to the query
         *
         * @param  {...String} args Variables/aliases to return
         * @return {Builder}
         */
        with(...args: Array<string>): Builder;

        /**
         * Create a new WhereSegment
         * @param  {...mixed} args
         * @return {Builder}
         */
        or(...args: Array<string>): Builder;

        /**
         * Create a new WhereSegment
         * @param  {...mixed} args
         * @return {Builder}
         */
        and(...args: Array<string>): Builder;

        /**
         * Query a full text index
         * @param {String} index (required) Index name as defined in the schema
         * @param {'nodeFulltext'|'relationshipFullText'} type (required) Type of FullText index (e.g. 'nodeFulltext' or 'relationshipFullText')
         * @param {String[]|{
         *     key?: string,
         *     value: string,
         *     operator?: 'AND'|'OR'|'NOT'|'+'|'-'
         * }[]} searchTerms (required) Search terms to query or an object of properties to search on
         *
         * @param {'AND'|'OR'|'NOT'|'+'|'-'} operator (optional) Operator to use for the search assuming the type of search term is a string array.
         * Defaults to 'AND'.
         * AND: Matches all terms
         * OR: Matches any term
         * NOT: Matches none of the terms, must be used with more than one term.
         * +: Requires the term to be present
         * -: Requires the term to not be present
         *
         * See more at https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Boolean%20operators
         * @param {String} alias (optional) Defaults to ${index name}
         * @param {String} scoreAlias (optional) Defaults to ${index name}_score
         */
        fullText(index: string, type: 'nodeFulltext' | 'relationshipFullText', searchTerms: string[] | {
            key?: string;
            value: string;
            operator?: 'AND' | 'OR' | 'NOT' | '+' | '-';
        }[], operator: 'AND' | 'OR' | 'NOT' | '+' | '-', alias: string, scoreAlias: string): Builder;

        /**
         * Query a vector index to retrieve nodes similar to a given query as determined by the query parameter
         * @param model {Neode.Model} Model to query
         * @param property {String} Vector property that has been indexed
         * @param nearestNeighbors {Number} Number of nearest neighbors to return
         * @param query {String | Array<Number>} Query, either as a property of a previous node (that is a vector) or a number array
         * @param [nodeAlias] {String} Alias of the node to return (Defaults to ${property}_node)
         * @param [scoreAlias] {String} Alias of the score to return (Defaults to ${property}_score)
         */
        vector(model: Model<any>, property: string, nearestNeighbors: number, query: string | Array<number>, nodeAlias?: string, scoreAlias?: string): Builder;

        /**
         * Add a where condition to the current statement.
         *
         * @param  {...mixed} args Argumenta
         * @return {Builder}
         */
        where(...args: Array<string>): Builder;

        /**
         * Add a where condition to the current statement, specifically comparing a property to a date value
         * @param arg Node property to compare
         * @param operator Comparison operator
         * @param date Date to compare to
         * @param type Date type, either 'datetime', 'date', or 'time' (default 'datetime')
         * This should be the type of the property being compared. (If the property is a datetime, use 'datetime', etc.)
         * @return {Builder}
         */
        whereDate(arg: string, operator: '=' | '<' | '<=' | '>' | '>=', date: Date, type?: 'datetime' | 'date' | 'time'): Builder;

        /**
         * Query on Internal ID
         *
         * @param  {String} alias
         * @param  {Int}    value
         * @return {Builder}
         */
        whereId(alias: string, value: number): Builder;

        /**
         * Set Delete fields
         *
         * @param  {...mixed} args
         * @return {Builder}
         */
        delete(...args: Array<string>): Builder;

        /**
         * Set Detach Delete fields
         *
         * @param  {...mixed} args
         * @return {Builder}
         */
        detachDelete(...args: Array<string>): Builder;

        /**
         * Set Return fields
         *
         * @param  {...mixed} args
         * @return {Builder}
         */
        return(...args: Array<string>): Builder;

        /**
         * Set Return Fields with Distinct values
         *
         * @param  {...string} args
         * @return {Builder}
         */
        returnDistinct(...args: Array<string>): Builder;

        /**
         * Set Record Limit
         *
         * @param  {Int} limit
         * @return {Builder}
         */
        limit(limit: number): Builder;

        /**
         * Set Records to Skip
         *
         * @param  {Int} skip
         * @return {Builder}
         */
        skip(skip: number): Builder;

        /**
         * Add an order by statement
         *
         * @param  {...String|object} args  Order by statements
         * @return {Builder}
         */
        orderBy(...args: Array<string | object>): Builder;

        /**
         * Add a relationship to the query
         *
         * @param  {String|RelationshipType} relationship  Relationship name or RelationshipType object
         * @param  {String}                  direction     Direction of relationship DIRECTION_IN, DIRECTION_OUT
         * @param  {String|null}             alias         Relationship alias
         * @param  {Int|String}              traversals    Number of traversals (1, "1..2", "0..2", "..3")
         * @return {Builder}
         */
        relationship(relationship: string | RelationshipType, direction: Neode.Direction, alias: string | null, traversals: number | string): Builder;

        /**
         * Complete a relationship
         * @param  {String} alias Alias
         * @param  {Model | false} model  Model definition. False for no model
         * @return {Builder}
         */
        to<T>(alias: string, model: Model<T> | false): Builder;

        /**
         * Complete the relationship statement to point to anything
         *
         * @return {Builder}
         */
        toAnything(): Builder;

        /**
         * Build the Query
         *
         * @param  {...String} output References to output
         * @return {Object}           Object containing `query` and `params` property
         */
        build(): { query: string, params: object };

        /**
         * Execute the query
         *
         * @return {Promise}
         */
        execute(mode?: Mode): Promise<QueryResult>;
    }

    class Queryable<T> {
        /**
         * @constructor
         *
         * @param Neode neode
         */
        constructor(neode: Neode);

        /**
         * Return a new Query Builder
         *
         * @return {Builder}
         */
        query(): Builder;

        /**
         * Create a new node
         *
         * @param  {object} properties
         * @return {Promise}
         */
        create(properties: T): Promise<Node<T>>;

        /**
         * Merge a node based on the defined indexes
         *
         * @param  {Object} properties
         * @return {Promise}
         */
        merge(properties: T): Promise<Node<T>>;

        /**
         * Merge a node based on the supplied properties
         *
         * @param  {Object} match Specific properties to merge on
         * @param  {Object} set   Properties to set
         * @return {Promise}
         */
        mergeOn(match: Object, set: Object): Promise<Node<T>>;

        /**
         * Delete all nodes for this model
         *
         * @return {Promise}
         */
        deleteAll(): Promise<void>;

        /**
         * Get a collection of nodes for this label
         *
         * @param  {Object}              properties
         * @param  {String|Array|Object} order
         * @param  {Int}                 limit
         * @param  {Int}                 skip
         * @return {Promise}
         */
        all(properties?: object, order?: string | Array<any> | object, limit?: number, skip?: number): Promise<EntityCollection>;

        /**
         * Find a Node by its Primary Key
         *
         * @param  {mixed} id
         * @return {Promise}
         */
        find(id: string | number): Promise<Node<T>>;

        /**
         * Find a Node by it's internal node ID
         *
         * @param  {int}    id
         * @return {Promise}
         */
        findById(id: number): Promise<Node<T>>;

        /**
         * Find a Node by properties
         *
         * @param  {String} label
         * @param  {mixed}  key     Either a string for the property name or an object of values
         * @param  {mixed}  value   Value
         * @return {Promise}
         */
        first(key: string | object, value: string | number): Promise<Node<T>>;

        /**
         * Get a collection of nodes within a certain distance belonging to this label
         *
         * @param  {Object}              properties
         * @param  {String}              location_property
         * @param  {Object}              point
         * @param  {Int}                 distance
         * @param  {String|Array|Object} order
         * @param  {Int}                 limit
         * @param  {Int}                 skip
         * @return {Promise}
         */
        withinDistance(location_property: string, point: { x: number, y: number, z?: number } | {
            latitude: number,
            longitude: number,
            height?: number
        }, distance: number, properties?: object, order?: string | Array<any> | object, limit?: number, skip?: number): Promise<EntityCollection>;
    }

    class ModelMap {
        models: Map<string, Model<any>>;

        /**
         * @constuctor
         *
         * @param {Neode} neode
         */
        constructor(neode: Neode);

        /**
         * Check if a model has been defined
         *
         * @param  {String} key
         * @return {boolean}
         */
        has(key): boolean;

        /**
         * Names of the models defined.
         *
         * @return {Array<String>}
         */
        keys(): Array<string>;

        /**
         * Getter
         *
         * @param key {String}
         * @return {Model|false}
         */
        get(key: string): Model<any> | false;

        /**
         * Setter
         *
         * @param  {String} key
         * @param  {Model}  value
         * @return {ModelMap}
         */
        set(key: string, value: Model<any>): ModelMap;

        /**
         * Run a forEach function on the models
         *
         * @param fn {Function}
         * @return {void}
         */
        forEach(fn: (model: Model<any>, key: string) => void): void;

        /**
         * Get the definition for an array labels
         *
         * @param  {Array} labels
         * @return {Definition}
         */
        getByLabels(labels): Model<any>[] | false;

        /**
         * Extend a model with extra configuration
         *
         * @param  {String} name   Original Model to clone
         * @param  {String} as     New Model name
         * @param  {Object} using  Schema changes
         * @return {Model}
         */
        extend(name: string, as: string, using: SchemaObject): Model<any>;
    }

    class Model<T> extends Queryable<T> {
        constructor(neode: Neode, name: string, schema: Neode.SchemaObject);

        /**
         * Get Model name
         *
         * @return {String}
         */
        name(): string;

        /**
         * Get Schema
         *
         * @return {Object}
         */
        schema(): Neode.SchemaObject;

        /**
         * Get a map of Properties
         *
         * @return {Map}
         */
        properties(): Map<string, any>;

        /**
         * Set Labels
         *
         * @param  {...String} labels
         * @return {Model}
         */
        setLabels(...labels: Array<string>): Model<T>;

        /**
         * Get Labels
         *
         * @return {Array}
         */
        labels(): Array<string>;

        /**
         * Add a property definition
         *
         * @param {String} key    Property name
         * @param {Object} schema Schema object
         * @return {Model}
         */
        addProperty(key: string, schema: Neode.SchemaObject): Model<T>;

        /**
         * Add a new relationship
         *
         * @param  {String} name                Reference of Relationship
         * @param  {String} type                Internal Relationship type
         * @param  {String} relationship        Internal Relationship name
         * @param  {String} direction           Direction of Node (Use constants DIRECTION_IN, DIRECTION_OUT, DIRECTION_BOTH)
         * @param  {String|Model|null} target   Target type definition for the
         * @param  {Object} schema              Property Schema
         * @param  {Bool} eager                 Should this relationship be eager loaded?
         * @param  {Bool|String} cascade        Cascade delete policy for this relationship
         * @return {Relationship}
         */
        relationship(name: string, type: string, relationship: string, direction?: Neode.Direction, target?: string | Model<T>, schema?: Neode.SchemaObject, eager?: boolean, cascade?: boolean | string): Relationship


        /**
         * Get all defined Relationships  for this Model
         *
         * @return {Map}
         */
        relationships(): Map<string, RelationshipType>;

        /**
         * Get relationships defined as Eager relationships
         *
         * @return {Array}
         */
        eager(): Array<Relationship>;

        /**
         * Get the name of the primary key
         *
         * @return {String}
         */
        primaryKey(): string;

        /**
         * Get array of hidden fields
         *
         * @return {String[]}
         */
        hidden(): Array<string>;

        /**
         * Get defined merge fields
         *
         * @return {Array}
         */
        mergeFields(): Array<string>;
    }

    class Schema {

        /**
         * Neode will install the schema created by the constraints defined in your Node definitions.
         */
        install(): Promise<void>;

        /**
         * Dropping the schema will remove all indexes and constraints created by Neode.
         * All other indexes and constraints will be left intact.
         */
        drop(): Promise<void>;
    }

    class RelationshipType {

        /**
         * Constructor
         * @param  {String} type                Reference of Relationship
         * @param  {String} relationship        Internal Neo4j Relationship type (ie 'KNOWS')
         * @param  {String} direction           Direction of Node (Use constants DIRECTION_IN, DIRECTION_OUT, DIRECTION_BOTH)
         * @param  {String|Model|null} target   Target type definition for the
         * @param  {Object} schema              Relationship definition schema
         * @param  {Bool} eager                 Should this relationship be eager loaded?
         * @param  {Bool|String} cascade        Cascade delete policy for this relationship
         * @return {Relationship}
         */
        constructor(type: string, relationship: string, direction: Neode.Direction, target: string | Model<any> | null, schema?: Neode.RelationshipSchema, eager?: boolean, cascade?: boolean | string);

        /**
         * Type
         *
         * @return {String}
         */
        type(): string;

        /**
         * Get Internal Relationship Type
         *
         * @return {String}
         */
        relationship(): string;

        /**
         * Set Direction of relationship
         *
         * @return {RelationshipType}
         */
        setDirection(direction: Neode.Direction): RelationshipType;

        /**
         * Get Direction of Node
         *
         * @return {String}
         */
        direction(): Neode.Direction;

        /**
         * Get the target node definition
         *
         * @return {Model}
         */
        target(): Model<any>;

        /**
         * Get Schema object
         *
         * @return {Object}
         */
        schema(): Neode.RelationshipSchema;

        /**
         * Should this relationship be eagerly loaded?
         *
         * @return {bool}
         */
        eager(): boolean;

        /**
         * Cascade policy for this relationship type
         *
         * @return {String}
         */
        cascade(): string;

    }

    class Relationship {

        /**
         * Constructor
         *
         * @param  {Neode}            neode         Neode Instance
         * @param  {RelationshipType} type          Relationship Type definition
         * @param  {Relationship}     relationship  Neo4j Relationship
         * @param  {Node}             from          Start node for the relationship
         * @param  {Node}             to            End node for the relationship
         * @return {Relationship}
         */
        constructor(neode: Neode, type: RelationshipType, relationship: Relationship, from: Node<any>, to: Node<any>);

        /**
         * Relationship Type definition for this node
         *
         * @return {RelationshipType}
         */
        type(): RelationshipType;

        /**
         * Get Internal Relationship ID
         *
         * @return {int}
         */
        id(): number;

        /**
         * Return Internal Relationship ID as Neo4j Integer
         *
         * @return {Integer}
         */
        idInt(): Integer;

        /**
         * Get Properties for this Relationship
         *
         * @return {Object}
         */
        properties(): object;

        /**
         * Get a property for this relationship
         *
         * @param  {String} property Name of property
         * @param  {or}     default  Default value to supply if none exists
         * @return {mixed}
         */
        get<T>(property: string, or?: T): T;

        /**
         * Get originating node for this relationship
         *
         * @return Node
         */
        startNode(): Node<any>;

        /**
         * Get destination node for this relationship
         *
         * @return Node
         */
        endNode(): Node<any>;

        /**
         * Get the node on the opposite end of the Relationship to the subject
         * (ie if direction is in, get the end node, otherwise get the start node)
         */
        otherNode(): Node<any>;

        /**
         * Convert Relationship to Object
         *
         * @return {Promise}
         */
        toJson(): Promise<string>;
    }

    class Node<T> {
        /**
         * @constructor
         *
         * @param  {Neode} neode  Neode Instance
         * @param  {Model} model  Model definition
         * @param  {node}  node   Node Object from neo4j-driver
         * @param  {Map}   eager  Eagerly loaded values
         * @return {Node}
         */
        constructor(neode: Neode, model: Model<T>, node: Neo4jNode, eager?: Map<string, EntityCollection>);

        /**
         * Model definition for this node
         *
         * @return {Model}
         */
        model(): Model<T>;

        /**
         * Get Internal Node ID
         *
         * @return {int}
         */
        id(): number;

        /**
         * Return Internal Node ID as Neo4j Integer
         *
         * @return {Integer}
         */
        idInt(): Integer;

        /**
         * Get a property for this node
         *
         * @param  {String} property Name of property
         * @param  {or}     default  Default value to supply if none exists
         * @return {mixed}
         */
        get<U>(property: string, or ?: U): U;

        /**
         * Get all properties for this node
         *
         * @return {Object}
         */
        properties(): T;

        /**
         * Update the properties of a node
         * @param  {Object} properties Updated properties
         * @return {Promise}
         */
        update(properties: T): Promise<Node<T>>;

        /**
         * Delete this node from the Graph
         *
         * @return {Promise}
         */
        delete(): Promise<Node<T>>;

        /**
         * Detach this node from another
         *
         * @param  {Node<any>} other Node to detach from
         * @return {Promise<[Node<any>, Node<any>]>}
         */
        detachFrom(other: Node<any>): Promise<[Node<any>, Node<any>]>;

        /**
         * Relate this node to another based on the type
         *
         * @param  {Node}   node            Node to relate to
         * @param  {String} type            Type of Relationship definition
         * @param  {Object} properties      Properties to set against the relationships
         * @param  {Boolean} force_create   Force the creation a new relationship? If false, the relationship will be merged
         * @return {Promise}
         */
        relateTo(node: Node<any>, type: string, properties ?: object, force_create ?: boolean): Promise<Relationship>;

        /**
         * When converting to string, return this model's primary key
         *
         * @return {String}
         */
        toString(): string;

        /**
         * Convert Node to Object
         *
         * @return {Promise}
         */
        toJson(): Promise<T>;
    }

    class EntityCollection {

        /**
         * @constructor
         * @param  {Neode} neode    Neode Instance
         * @param  {Node[]|Relationship[]} values  Array of Node
         */
        constructor(neode: Neode, values: Array<Node<any> | Relationship>);

        /**
         * Get length property
         *
         * @return {Int}
         */
        length: number;

        /**
         * Iterator
         */
        [Symbol.iterator](): IterableIterator<Node<any> | Relationship>;

        /**
         * Get a value by it's index.
         * It's important to note that for retrieving relationships (using Node.get)
         * the order is in reverse to the order they are added in.
         *
         * @param  {Int} index
         * @return {Node}
         */
        get(index: number): Node<any> | Relationship;

        /**
         * Get the first Node in the NodeCollection
         *
         * @return {Node}
         */
        first(): Node<any> | Relationship;

        /**
         * Map a function to all values
         *
         * @param  {Function} fn
         * @return {mixed}
         */
        map<U>(fn: (value: Node<any> | Relationship, index: number, array: Array<Node<any> | Relationship>) => U): Array<U>;

        /**
         * Find node with function
         *
         * @param  {Function} fn
         * @return {mixed}
         */
        find<U>(fn: (value: Node<any> | Relationship, index: number, array: Array<Node<any> | Relationship>) => U): Node<U> | Relationship;


        /**
         * Run a function on all values
         * @param  {Function} fn
         * @return {mixed}
         */
        forEach(fn: (value: Node<any> | Relationship, index: number, array: Array<Node<any> | Relationship>) => any): any;

        /**
         * Map the 'toJson' function on all values
         *
         * @return {Promise}
         */
        toJson(): Promise<object>;

    }

}
