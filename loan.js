var calculator = {
    currency: 'EUR',
    amount: 20000,
    period: 12,
    riskLevels: [
      { from: 0.02, to: 0.04 },
      { from: 0.04, to: 0.06 },
      { from: 0.06, to: 0.07 },
      { from: 0.07, to: 0.085 },
      { from: 0.085, to: 0.095 },
      { from: 0.095, to: 0.115 }
    ],
    risk: null,
    init() {
      this.showAmount();
      this.showPeriod();
      this.showRiskLevels();
    },
    formatter: function(num) {
       return num.toFixed(0).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    },
    setCurrency: function(event) {
       this.currency = event.target.value;
       this.calculateLoan();
    },
    setAmount: function(event) {
      this.amount = parseInt(event.target.value);
      this.updateStyle(event.target);
      this.calculateLoan();
      this.showAmount();
    },
    setPeriod: function(event) {
      this.period = event.target.value;
      this.updateStyle(event.target);
      this.calculateLoan();
      this.showPeriod();
    },
    showAmount: function() {
      const amountDiv = document.getElementById('amount');
      amountDiv.innerHTML = this.formatter(this.amount);
    },
    showPeriod: function() {
      const periodDiv = document.getElementById('period');
      periodDiv.innerHTML = this.period + ' months';
    },
    setRiskLevel: function(index) {
      this.risk = this.riskLevels[index];
      const nominal = document.getElementById('nominal');
      nominal.innerHTML = `Nominal interest: ${(this.risk.from * 100).toFixed(1)}% - ${(this.risk.to * 100).toFixed(1)}%`;
      this.calculateLoan();
    },
    showRiskLevels: function() {
      const levels = document.getElementById('levels');
      for (let i = 0; i < this.riskLevels.length; i++) {
          levels.innerHTML += `
             <div class="col-2">
               <div id="level-${i}" class="rating">
                 ${i + 1}
               </div>
            </div>
          `;
      }
      
      if (!this.risk) {
        const selectedRating = document.getElementById('level-0');
        selectedRating.classList.add('selected');
        this.setRiskLevel(0);
      }

      const ratings = document.querySelectorAll('.rating');
      const self = this;
      ratings.forEach(function(rating) {
          rating.addEventListener('click', function(event) {
          ratings.forEach(
            function(item) { item.classList.remove('selected') }
          );
          rating.classList.add('selected');
          const id = event.target.id[event.target.id.length - 1];
          self.setRiskLevel(id);
        });
      });
      
    },
    calculateMonthlyCost: function(risk) {
      const i = risk / 12;
      return this.amount * (i + (i / (Math.pow((1 + i), this.period) - 1)));
    },
    calculateLoan: function() {
      
      const A1 = this.calculateMonthlyCost(this.risk.from);
      const A2 = this.calculateMonthlyCost(this.risk.to);
      
      const total = document.getElementById('total');
      total.innerHTML = `${this.currency} ${this.formatter(A1)} - ${this.formatter(A2)}`;
      
    },
    updateStyle: function(element) {
      const percentage = (100 * (element.value - element.min)) / (element.max - element.min);
	    const bg = `linear-gradient(90deg, #3AABB9 ${percentage}%, #CBCBCB ${percentage + 0.1}%)`;
	    element.style.background = bg;
    }
}

calculator.init();
