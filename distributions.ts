namespace FP_Statistics
{
    abstract class Distribution
    {
        // probability from x1 to x2
        public abstract probability(x1:number, x2?:number):number;
        public abstract mean():number;
        public abstract variance():number;

        //Conversion to z-values, assuming the distribution can be 
        //approximated to normal
        zValue(x:number):number
        {
            return (x-this.mean()) / (this.standarddeviation());
        }

        public standarddeviation():number
        {
            return Math.sqrt(this.variance());
        }
    }

    //Writing this so it can be used both statically and object-wise
    //the object uses the methods of the class on its state, making for a hybrid experience
    export class BinomialDistribution extends Distribution
    {
        n:number;
        p:number;

        public static probability(n:number, p:number, x1:number, x2?:number)
        {
            if(!x2) x2 = x1;
            let res:number = 0;
            for(var x=x1;x<=x2;x++)
                res+=(this._choose(n, x)*Math.pow(p, x)*Math.pow(1-p, n-x));
            return res;    
        }

        public static mean(n:number, p:number)
        {
            return n*p;
        }

        public static variance(n:number, p:number)
        {
            return n*p*(1-p);
        }

        public static standarddeviation(n:number, p:number)
        {
            return Math.sqrt(BinomialDistribution.variance(n,p));
        }

        constructor(n:number,p:number)
        {
            super();
            this.n = n;
            this.p = p;
        }

        private static factorial(n:number):number
        {
            var res:number = 1;
            for(var i=n;i>1;i--) res*=i;
            return res;
        }

        private static _choose(n:number,x:number):number
        {
            return (this.factorial(n)/ ((this.factorial(x)*this.factorial(n-x))));
        }

        public probability(x1:number,x2?:number):number
        {
            return BinomialDistribution.probability(this.n,this.p,x1,x2);    
        }

        public mean():number
        {
            return BinomialDistribution.mean(this.n, this.p);
        }

        public variance():number
        {
            return BinomialDistribution.variance(this.n, this.p);
        }

    }
    
    export class NormalDistribution extends Distribution
    {
        mu:number;
        sigma:number;
        
        constructor(mu:number, sigma:number)
        {
            super();
            this.mu = mu;
            this.sigma = sigma;
        }

        public mean():number
        {
            return this.mu;
        }

        public variance():number
        {
            return this.sigma*this.sigma;
        }

        public standarddeviation()
        {
            return this.sigma;
        }

        //this one can be a problem. The best way would be a table for the z values
        public probability(x1:number, x2:number):number
        {
            throw new Error("Not yet implemented");
        }


    }

    export class SampleProportionDistribution extends Distribution
    {
        p:number;
        n:number;

        constructor(n:number, p:number)
        {
            super();
            this.n = n;
            this.p = p;
        }

        public mean():number
        {
            return this.p;
        }

        public standarddeviation():number
        {
            return (this.p*(1-this.p))/this.n;
        }

        public variance():number
        {
            return this.standarddeviation()*this.standarddeviation();
        }

        public probability(x1:number, x2:number):number
        {
            //would be good to get to the z-values;
            var z1 = this.zValue(x1);
            var z2 = this.zValue(x2);

            
        }

    }

}