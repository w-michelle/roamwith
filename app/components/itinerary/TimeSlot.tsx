interface TimeSlotProp {
  handleTimeChange: (slot: string, value: string) => void;
  timeSlot: {
    stb: string;
    ste: string;
    etb: string;
    ete: string;
  };
}

export const TimeSlot = ({ handleTimeChange, timeSlot }: TimeSlotProp) => {
  return (
    <>
      <select
        onChange={(e) => handleTimeChange("stb", e.target.value)}
        value={timeSlot.stb}
        id="hours"
        name="hours"
        className="appearance-none bg-transparent text-cusText border-transparent  focus:outline-none focus:border-transparent focus:ring-0"
      >
        <option value="00">00</option>
        <option value="01">01</option>
        <option value="02">02</option>
        <option value="03">03</option>
        <option value="04">04</option>
        <option value="05">05</option>
        <option value="06">06</option>
        <option value="07">07</option>
        <option value="08">08</option>
        <option value="09">09</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
        <option value="13">13</option>
        <option value="14">14</option>
        <option value="15">15</option>
        <option value="16">16</option>
        <option value="17">17</option>
        <option value="18">18</option>
        <option value="19">19</option>
        <option value="20">20</option>
        <option value="21">21</option>
        <option value="22">22</option>
        <option value="23">23</option>
      </select>
      <div>:</div>
      <select
        onChange={(e) => handleTimeChange("ste", e.target.value)}
        value={timeSlot.ste}
        id="minutes"
        name="minutes"
        className="appearance-none bg-transparent focus:outline-none border-transparent focus:border-transparent focus:ring-0"
      >
        <option value="00">00</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
      </select>
      <div>-</div>
      <select
        onChange={(e) => handleTimeChange("etb", e.target.value)}
        value={timeSlot.etb}
        id="hours"
        name="hours"
        className="appearance-none bg-transparent text-cusText border-transparent  focus:outline-none focus:ring-0"
      >
        <option value="00">00</option>
        <option value="01">01</option>
        <option value="02">02</option>
        <option value="03">03</option>
        <option value="04">04</option>
        <option value="05">05</option>
        <option value="06">06</option>
        <option value="07">07</option>
        <option value="08">08</option>
        <option value="09">09</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
        <option value="13">13</option>
        <option value="14">14</option>
        <option value="15">15</option>
        <option value="16">16</option>
        <option value="17">17</option>
        <option value="18">18</option>
        <option value="19">19</option>
        <option value="20">20</option>
        <option value="21">21</option>
        <option value="22">22</option>
        <option value="23">23</option>
      </select>
      <div>:</div>
      <select
        onChange={(e) => handleTimeChange("ete", e.target.value)}
        value={timeSlot.ete}
        id="minutes"
        name="minutes"
        className="appearance-none bg-transparent focus:outline-none border-transparent focus:border-transparent focus:ring-0"
      >
        <option value="00">00</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
      </select>
    </>
  );
};
