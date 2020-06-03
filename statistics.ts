// typescript
namespace FP_Statistics
{

    // Data Set    
    export class DataSet
    {
        data:number[];
        ordered:number[];


        constructor(v:number[])
        {
            this.data = v;
            var tmp = [];
            for(var i=0;i<v.length;i++) tmp.push(v[i]);
            //bad one, but let's bear with it
            for(var i=0;i<v.length-1;i++)
                for(var k=i+1;k<v.length;k++)
                    if(tmp[i]>tmp[k]) this._swap(tmp, i, k);
            this.ordered = tmp;
    
        }

        private _swap(tmp:number[],i:number,k:number):void
        {
            var t  = tmp[i];
            tmp[i] = tmp[k];
            tmp[k] = t;
        }
    
        mean():number
        {
            if(this.data.length==0)
                return 0;
            if(this.data.length==1)
                return this.data[0];
            var res = 0;
            for(var i=0;i<this.data.length;i++) res+=this.data[i];
            return res / this.data.length;
        }

        variance():number
        {
            var res = 0;
            var n = this.data.length;
            var avg = this.mean();
            for(var i=0;i<n;i++)
                res+=Math.pow(this.data[i]-avg,2)/(n-1);
            return res;
        }
    
        stddev():number
        {
            return Math.sqrt(this.variance());
        }

        //Median. Half is above, half is below
        median():number
        {
            return this.percentile(0.5);
        }

        //helper.
        private _isInteger(pos:any):boolean
        {
            return pos==parseInt(pos);
        }

        //helper.
        private parseInt(pos:any):number
        {
            return parseInt(pos);
        }

        //percentile
        //if n is percentile(0.3), 30% of the values are under n
        percentile(n:number):number
        {
            if(n<=0) return this.ordered[0];
            if(n>=1) return this.ordered[this.ordered.length-1];
            var pos = (this.data.length * n); 
            return 	this._isInteger(pos) 								            ? 
                    this.ordered[this.parseInt(pos)]								:
                    (
                        this.ordered[this.parseInt(pos)-1] 
                        + 
                        this.ordered[this.parseInt(pos)+1]
                    ) / 2	;
        }
    

        //five number summary
        fns():number[]
        {
            return [this.percentile(0), this.percentile(0.25), this.percentile(0.5), this.percentile(0.75), this.percentile(1)];
        }

        //Inter quartile range
        //the "center" of the dataset. Contains 50% of it
        iqr():number
        {
            return this.percentile(0.75)-this.percentile(0.25);
        }
    
        //maximum range of the variables. Goes from min to max value.
        range():number
        {
            return this.ordered[this.ordered.length-1] - this.ordered[0];
        }
    
        // % of points within n stddevs of mean
        around(n:number):number
        {
            //n is the number of standard deviations
            var delta = n * this.stddev();
            var mean = this.mean();
            var res = 0;
            for(var i=0;i<this.data.length;i++)
                if(this.data[i]>=(mean-delta) || this.data[i]<=(mean+delta))
                    res++;
            return (res / this.data.length)*100;
        }


        //A random variable with a normal distribution
        //would have around 68%, 95% and 99.7% within 1,2,3 stdev of its mean
        normalresemblance():number[]
        {
            return [Math.abs(this.around(1)-68)/68, Math.abs(this.around(2)-95)/95, Math.abs(this.around(3)-99.7)/99.7];
        }

        private parseFloat(x:any):number
        {
            return parseFloat(x);
        }

        //fashion. most common value or values
        fashion():number[]
        {
            var freq:object = {};
            var ordered = this.ordered;
            for(var i=0;i<ordered.length;i++)
                if(freq[ordered[i]])
                    freq[ordered[i]]++;
                else
                    freq[ordered[i]]=1;
            
            var max = 0;
            var keys = Object.keys(freq);
            var nkeys:number[] = [];
            for(var i=0;i<keys.length;i++) 
                nkeys.push(this.parseFloat(keys[i]));
            for(var i=0;i<nkeys.length;i++)
                if(freq[nkeys[i]]>max) max = freq[nkeys[i]];
            var res:number[] = [];
            for(var i=0;i<nkeys.length;i++)
                if(freq[nkeys[i]]==max)
                    res.push(nkeys[i]);
            return res;		
        }

    }
  


}