export default {
    ivory: 'rgb(240, 227, 206)',
    dark: 'rgb(30, 30, 30)',
    red: 'rgb(200, 0, 0)',
    blue: 'rgb(0, 0, 200)',
    grey: 'rgb(150, 150, 150)'
};

export class Vec {
    private v: [number, number];

    constructor(v: [number, number]) {
        this.v = v;
    }

    val(): [number, number] {
        return this.v;
    }

    add(v: number | [number, number]): Vec {
        if (Array.isArray(v)) {
            return new Vec([v[0] + this.v[0], v[1] + this.v[1]]);
        } else {
            return new Vec([v + this.v[0], v + this.v[1]]);
        }
    }

    mul(n: number): Vec {
        return new Vec([n*this.v[0], n*this.v[1]]);
    }

    div(n: number): Vec {
        return new Vec([this.v[0]/n, this.v[1]/n]);
    }

    quot(n: number): Vec {
        return new Vec([Math.floor(this.v[0]/n), Math.floor(this.v[1]/n)]);
    }
}