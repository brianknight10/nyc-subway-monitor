'use strict';

const program = require('commander');
const fs = require('fs');
const yaml = require('js-yaml');

// function names
const PREFIX = 'subway-monitor-production-';  // package name and sls env
const RETRIEVER_FUNCTION = PREFIX + 'retriever';
const SENDER_FUNCTION = PREFIX + 'sender';

// state machine templates
const MACHINE_TEMPLATE = fs.readFileSync('statemachine/template.json', 'utf8');
const IAM_TEMPLATE = fs.readFileSync('statemachine/template-iam-role.json', 'utf8');

// YAML config (serverless.yml)
const SERVERLESS_YAML_FILENAME = './serverless.yml';
var serverlessYaml = yaml.safeLoad(fs.readFileSync(SERVERLESS_YAML_FILENAME, 'utf8'));
const DEFAULT_AWS_REGION = 'us-east-1';

// program definition
program
    .version('1.0.0')
    .option('-A, --account <id>', 'Your AWS Account ID')
    .option('-R, --region [name]', 'The AWS Region name', DEFAULT_AWS_REGION)
    .parse(process.argv);

if (!program.account) {
    return console.error('Missing account id, use -A or --account\n');
}

(function runCommand(accountId, region) {

    const stateMachineStr = buildStateMachine(accountId, region);

    // update state machine definition
    var subwayMonitorStateMachine = serverlessYaml.resources.Resources.SubwayMonitorStateMachine;
    subwayMonitorStateMachine.Properties.DefinitionString = stateMachineStr;

    // update IAM assume role policy document (region required)
    var iamRole = serverlessYaml.resources.Resources.SubwayMonitorStateMachineRole;
    iamRole.Properties.AssumeRolePolicyDocument = createIAMRolePolicyDocument({REGION: region});

    // write back to yaml file
    const newYaml = yaml.safeDump(serverlessYaml, {lineWidth: 999999});
    fs.writeFileSync(SERVERLESS_YAML_FILENAME, newYaml);

    console.log('Done. Check your serverless.yml file :)\n');

})(program.account, program.region);


function buildStateMachine (accountId, region) {

    var machineTemplate = JSON.parse(MACHINE_TEMPLATE),
        vars = {'REGION': region, 'ACCOUNT_ID': accountId};

    return applyTemplateVars(JSON.stringify(machineTemplate), vars);
}

function createIAMRolePolicyDocument (vars) {
    const doc = applyTemplateVars(IAM_TEMPLATE, vars);
    return JSON.parse(doc);
}

function applyTemplateVars (template, vars) {
    return template
        .replace(/\{REGION\}/g, vars.REGION)
        .replace(/\{ACCOUNT_ID\}/g, vars.ACCOUNT_ID)
        .replace(/\{RETRIEVER_FUNCTION\}/g, RETRIEVER_FUNCTION)
        .replace(/\{SENDER_FUNCTION\}/g, SENDER_FUNCTION)
    ;
}

function str2list (str) {
    return str.split(',');
}