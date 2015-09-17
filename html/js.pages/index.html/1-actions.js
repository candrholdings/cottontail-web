var Actions = local.Actions = Reflux.createActions({
    addStep: {},
    removeStep: {},
    setStepArgs: {},
    moveStepUp: {},
    moveStepDown: {},
    runAll: { children: ['completed', 'failed'] },
    runCommand: { children: ['completed', 'failed'] }
});
