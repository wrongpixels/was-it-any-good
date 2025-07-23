export interface ParamStructure {
  readonly name: string;
  readonly applied: boolean;
}

class ParamManager {
  params: readonly ParamStructure[];

  constructor(allParams: readonly string[], activeParams: readonly string[]) {
    this.params = allParams
      .filter((p: string) => p)
      .map((p: string) => ({
        name: p,
        applied: activeParams.includes(p),
      }));
  }

  public toggleParam(paramToToggle: ParamStructure): void {
    const newActiveParams = this.params.map((p: ParamStructure) => {
      if (p.name === paramToToggle.name) {
        return { ...p, applied: !p.applied };
      }
      return p;
    });
    this.params = newActiveParams;
  }

  public getAppliedParams(): string[] {
    return this.params
      .filter((p: ParamStructure) => p.applied)
      .map((f: ParamStructure) => f.name);
  }
}

export default ParamManager;
