export default {
    ivory: 'rgb(240, 227, 206)',
    dark: 'rgb(30, 30, 30)',
    red: 'rgb(200, 0, 0)',
    blue: 'rgb(0, 0, 200)'
};

export class Vec {
    private v: [number, number];

    constructor(v: [number, number]) {
        this.v = v;
    }

    val(): [number, number] {
        return this.v;
    }

    add(v: [number, number]): Vec {
        return new Vec([v[0] + this.v[0], v[1] + this.v[1]]);
    }

    mul(n: number): Vec {
        return new Vec([n*this.v[0], n*this.v[1]]);
    }
}