import axios from "axios";

const BASE_URL8080 = "http://localhost:8080/api";
const BASE_URL8000 = "http://localhost:8000/api";

export const fetchElections = async ({ type = "", state = "" } = {}) => {
    try {
        const url = `${BASE_URL8080}/elections?type=${type}&state=${state}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch elections:", error);
        return [];
    }
};

export const getElectionDetailByElectoinId = async (electionId) => {
    try {
        const url = `${BASE_URL8080}/elections/${electionId}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch election Detail:", error);
        return [];
    }
};

export const voteCandidate = async (electionId, user) => {
    try {
        await axios.put(`http://localhost:8080/api/elections/vote`, {
            electionId,
            user,
        });
        return;
    } catch (error) {
        console.error("Failed to Vote election:", error);
        return;
    }
};
