export function cleanData(raw_data){
    let cleaned_data = {}
    const data = raw_data.data
    data.forEach((school_slots)=>{
        let school = school_slots[0]
        for (let i = 1; i < school_slots.length; i++) {
            if (school_slots[i] !== ""){
                if (school_slots[i] in cleaned_data){
                    cleaned_data[school_slots[i]].push(school)
                } 
                else{
                    cleaned_data[school_slots[i]] = [school]
                }
            }
          }
    })
    return cleaned_data
}