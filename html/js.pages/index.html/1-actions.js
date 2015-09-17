var Actions = local.Actions = Reflux.createActions({
    addStep: {},
    removeStep: {},
    setStepArgs: { sync: true },
    moveStepUp: {},
    moveStepDown: {},
    runAll: { children: ['completed', 'failed'] },
    runCommand: { children: ['completed', 'failed'] }
});
